var request = require("request");
var Step = require("step");
var BeatsAPI = require("./bapi.js");

// TODO: Create a database/table to persist user information. Necessary for assigning
// weights to genres and remembering them for later sessions. Separate into different module

// TODO: Create utility function(s) for parsing/validating response from Beats API.

var client_id = "";
var genres = [];
var _genreMap = {};
var users = {};

/*
var internals = {
	client_id: "",
	genres: [],
	_genreHash: {}
	users: {}
}
*/

var BeatsRandomizer = function(options) {
	client_id = options.client_id;
	this.initialize();
};

BeatsRandomizer.prototype = {};

BeatsRandomizer.prototype.randomize = function(user_id, callback) {
	// TODO: Take into consideration the weight of the genre, based of user's preferences
	var randomGenre = Math.floor(Math.random()*genres.length);
	var randomTrack = Math.floor(Math.random()*genres[randomGenre].tracks.length);

	var track_id = genres[randomGenre].tracks[randomTrack].id;
	Step(
		function getTrackInfo() {

			BeatsAPI.Tracks.lookup({
				track_id: track_id,
				client_id: client_id
			}, this.parallel());

			BeatsAPI.Images.Tracks.fetchDefault({
				track_id: track_id,
				size: "large",
				client_id: client_id
			}, this.parallel());

		},
		function invokeCallback(err) {
			if (err) throw err;

			var trackInfo, imageSrc;
			for (var i=1; i<arguments.length; i++) {
				var result = BeatsAPI.parseResponse(arguments[i]);

				if (result.errorCode != 0) {
					callback({
						errorCode: result.errorCode,
						errorMsg: result.errorMsg
					});
					return undefined;
				}

				if (i == 1) {
					trackInfo = result.apiResponse.data;
				} else if (i == 2) {
					imageSrc = result.apiResponse.info.location;
				}
			}

			var tracks = users[user_id].tracks;
			var inPlaylist = false;
			for (var i=0; i<tracks.length; i++) {
				if (trackInfo.id == tracks[i].id) {
					inPlaylist = true;
					break;
				}
			}

			callback({
				id: trackInfo.id,
				title: trackInfo.title,
				artist: trackInfo.artist_display_name,
				duration: trackInfo.duration,
				image: imageSrc,
				liked: inPlaylist
			});
		}
	)
};

BeatsRandomizer.prototype.getPlaylist = function(user_id, accessToken, callback) {
	// Create Randomizer playlist if it doesn't already exist
	Step(
		function getPlaylistCollection() {
			BeatsAPI.Playlists.user({
				user_id: user_id,
				access_token: accessToken
			}, this);
		},
		function findRandomizerPlaylist(err, response) {
			if (err) throw err;

			var result = BeatsAPI.parseResponse(response);

			if (result.errorCode != 0) {
				console.log(result.errorMsg);
				callback();
				return undefined;
			}

			var data = result.apiResponse.data;
			for (var i=0; i<data.length; i++) {
				var playlist = data[i];
				if (playlist.name == "Randomizer") {
					var tracks = [];
					if (playlist.refs.tracks) {
						playlist.refs.tracks.forEach(function(track) {
							tracks.push({
								id: track.id,
								name: track.display
							});
						})
					}
					users[user_id] = {
						id: playlist.id,
						tracks: tracks
					};

					callback(playlist.id);
					return undefined;
				}
			}

			return null;
		},
		function createPlaylist(err) {
			if (err) throw err;

			BeatsAPI.Playlists.create({
				name: "Randomizer",
				access_token: accessToken
			}, this);
		},
		function getPlaylistId(err, response) {
			if (err) throw err;

			var result = BeatsAPI.parseResponse(response);

			if (result.errorCode != 0) {
				console.log(result.errorMsg);
				callback();
				return undefined;
			}

			callback(result.apiResponse.data.id);
		}
	);
};

BeatsRandomizer.prototype.initialize = function initialize() {
	// Get genres and featured tracks for genre
	// TODO: To get more songs, we can iterate over the playlists in the genre. However, that
	// would require some mechanism to limit API queries per second. As a developer, I'm limited to 15/sec
	Step(
		function getAvailableGenres() {
			BeatsAPI.Genre.collection({
				limit: 10,
				client_id: client_id
			}, this);
		},
		function getFeaturedTracks(err, response) {
			if (err) throw err;

			var result = BeatsAPI.parseResponse(response);
			if (result.errorCode != 0) {
				console.log(result.errorMsg);
				return undefined;
			}
			
			var data = result.apiResponse.data;
			var group = this.group();

			data.forEach(function(genre) {
				genres.push({ 
					id: genre.id,
					name: genre.name,
					tracks: []
				});
				_genreMap[genre.id] = genres.length-1;

				BeatsAPI.Genre.featured({
					genre_id: genre.id,
					limit: 200,
					client_id: client_id
				}, group());
			});
		},
		function organizeItAll(err, results) {
			if (err) throw err;

			var regex = /\/v1\/api\/genres\/([^\/]*)\/featured/;
			results.forEach(function(response) {
				var result = BeatsAPI.parseResponse(response);
				if (result.errorCode != 0) {
					console.log(result.errorMsg);
					return undefined;
				}

				var match = regex.exec(result.request.url.pathname);
				var genre_id;
				if (match) {
					genre_id = match[1];
				}

				var data = result.apiResponse.data;
				data.forEach(function(item) {
					switch (item.type) {
						case "track":
							// Not sure if this a valid item type for this query
							break;
						default:
							item.refs.tracks.forEach(function(track) {
								genres[_genreMap[genre_id]].tracks.push({
									id: track.id,
									name: track.display
								});
							});
							break;
					}
				});
			});
		}
	);
};

BeatsRandomizer.prototype.addItem = function(user_id, track_id, accessToken, callback) {
	
	var tracks = users[user_id].tracks
	for (var i=0; i<tracks.length; i++) {
		if (track_id == tracks[i].id) {
			return;
		}
	}

	tracks.push(track_id);

	BeatsAPI.Playlists.Tracks.append({
		playlist_id: users[user_id].id,
		track_ids: track_id,
		access_token: accessToken
	}, function(err, response, body) {
		if (err) throw err;
		var result = BeatsAPI.parseResponse(response);
		callback({
			errorCode: result.errorCode,
			errorMsg: result.errorMsg
		});
	});
};

BeatsRandomizer.prototype.removeItem = function(user_id, track_id, accessToken, callback) {

	var tracks = users[user_id].tracks;
	var index = -1;

	for (var i=0; i<tracks.length; i++) {
		if (track_id == tracks[i].id) {
			index = i;
			break;
		}
	}

	if (index == -1) return;
	users[user_id].tracks.splice(index, 1);

	var track_ids = [];
	tracks.forEach(function(track) {
		track_ids.push(track.id);
	});

	BeatsAPI.Playlists.Tracks.update({
		playlist_id: users[user_id].id,
		track_ids: track_ids,
		access_token: accessToken
	}, function(err, response, body) {
		if (err) throw err;
		var result = BeatsAPI.parseResponse(response);
		console.log(result);
		callback({
			errorCode: result.errorCode,
			errorMsg: result.errorMsg
		});
	});
};


module.exports = BeatsRandomizer;
var request = require("request");
var Hoek = require("hoek");
//var _ = require("underscore");

var defaults = {
	baseURL: "https://partner.api.beatsmusic.com/v1/"
}

/************* Playlists Endpoint *************/
var Playlists = { 
	Tracks: {} 
};
Playlists.user = function(params, callback) {
	params = Hoek.applyToDefaults({}, params);
	params = parseParameters(params);

	var user_id = params.user_id;
	delete params.user_id;
	
	request({
		method: "GET",
		url: defaults.baseURL+"api/users/"+user_id+"/playlists",
		qs: params
	}, callback);
};
Playlists.create = function(params, callback) {
	params = parseParameters(params);

	request({
		method: "POST",
		url: defaults.baseURL+"api/playlists/",
		qs: params
	}, callback);
};
Playlists.Tracks.update = function(params, callback) {
	params = Hoek.applyToDefaults({}, params);
	params = parseParameters(params);

	var playlist_id = params.playlist_id;
	delete params.playlist_id;

	console.log(params);

	request({
		method: "PUT",
		url: defaults.baseURL+"api/playlists/"+playlist_id+"/tracks",
		qs: params
	}, callback);

};
Playlists.Tracks.append = function(params, callback) {
	params = Hoek.applyToDefaults({}, params);
	params = parseParameters(params);
	
	var playlist_id = params.playlist_id;
	delete params.playlist_id;

	request({
		method: "POST",
		url: defaults.baseURL+"api/playlists/"+playlist_id+"/tracks",
		qs: params
	}, callback);
};


/************* Genre Endpoint *************/
var Genre = {}
Genre.collection = function(params, callback) {
	params = Hoek.applyToDefaults({}, params);
	params = parseParameters(params);

	request({
		method: "GET",
		url: defaults.baseURL+"api/genres",
		qs: params
	}, callback);
};
Genre.featured = function(params, callback) {
	params = Hoek.applyToDefaults({}, params);
	params = parseParameters(params);

	var genre_id = params.genre_id;
	delete params.genre_id;

	request({
		method: "GET",
		url: defaults.baseURL+"api/genres/"+genre_id+"/featured",
		qs: params
	}, callback);
};


/************* Tracks Endpoint *************/
var Tracks = {}
Tracks.lookup = function(params, callback) {
	params = Hoek.applyToDefaults({}, params);
	params = parseParameters(params);
	
	var track_id = params.track_id;
	delete params.track_id;

	request({
		method: "GET",
		url: defaults.baseURL+"api/tracks/"+track_id,
		qs: params
	}, callback);
}


/************* Images Endpoint *************/
var Images = {
	Tracks: {}
};
Images.Tracks.fetchDefault = function(params, callback) {
	params = Hoek.applyToDefaults({}, params);
	params = parseParameters(params);

	var track_id = params.track_id;
	delete params.track_id

	request({
		method: "GET",
		url: defaults.baseURL+"api/tracks/"+track_id+"/images/default",
		qs: params,
		followRedirect: false
	}, callback);
};


// Keep stateless for now. If we want to override baseURL, I'll need to refactor
var BeatsAPI = {};

// Add endpoints to BeatsAPI
BeatsAPI.Tracks = Tracks;
BeatsAPI.Playlists = Playlists;
BeatsAPI.Genre = Genre;
BeatsAPI.Images = Images;


function parseParameters(params) {
	/*
	Perform some type of validation?

	var keys = Object.keys(params);
	keys.forEach(function(key) {
		if (params[key] instanceof Array) {
			params[key] = params[key].reduce(function(previous, currentValue) {
				if (previous) {
					return previous+"&"+key+"="+currentValue;
				}
				return currentValue;
			}, null);
		}
	});
	*/

	return params;
}

BeatsAPI.parseResponse = function parseResponse(response) {
	
	var result = {
		request: response.request,
		statusCode: response.statusCode,
		headers: response.headers,
		errorCode: 0,
		errorMsg: "No Error",
		apiResponse: {}
	};

	/* *******************************************************************
	 * Valid status codes:
	 * 	   401 Unauthorized -- content-type: text/xml
	 * 	   400 Bad Request -- content-type: text/html
	 * 	   200 OK -- content-type: application/json
	 *     302 Found -- HTTP redirect, see location of header
	 *********************************************************************/

	switch (response.statusCode) {
		case 200:
			try {
				result.apiResponse = JSON.parse(response.body);
			} catch (e) {
				result.errorCode = 2;
				result.errorMsg = e.message;
			}
			break;
		case 302:
			result.apiResponse = {
				data: [],
				info: { location: response.headers.location },
				code: "Redirect"
			};
			break;
		case 400:
			result.errorCode = 1;
			result.errorMsg = response.body;
			break;
		case 401:
			result.errorCode = 1;
			result.errorMsg = response.body;
			break;
		default:
			console.log("Unrecogized status code: " + response.statusCode);
			break;
	}

	return result;
}


module.exports = BeatsAPI;
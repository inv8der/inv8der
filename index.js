var Hapi = require("hapi");
var BeatsRandomizer = require("./lib/randomizer");

var randomizer = new BeatsRandomizer({client_id: "38q2wmxsng5k7gdbj5vyq8t6"});

var config = {
    urls: {
        failureRedirect: "/login",
        successRedirect: "/"
    },
    beatsmusic: {
        clientID: "38q2wmxsng5k7gdbj5vyq8t6",
        clientSecret: "bjXb8gxAuSUFbeF2wuPWG9dx",
        callbackURL: "http://inv8der.herokuapp.com/auth/beatsmusic/callback"
    }
};

var plugins = {
    "yar": {
        cookieOptions: {
            password: "cookiemonster",
            isSecure: false
        }
    },
    "./plugins/beats-authenticator": config
};

var server = new Hapi.Server({
	views: {
        engines: { html: "handlebars" },
        path: "./views"
	}
});

server.pack.require(plugins, function(err) {
	if (err) throw err;
});

// Registers the authentication strategy to use
server.auth.strategy("passport", "passport");

server.route({
	path: "/",
	method: "GET",
	config: { 
		auth: "passport",
		handler: function(request, reply) {
			var user_id = request.session.user.profile.id;
			var accessToken = request.session.user.accessToken;

			//randomizer.createSession(request.session);

			randomizer.getPlaylist(user_id, accessToken, function(playlist_id) {
				console.log(playlist_id);
			});

			reply.view("index", {
				clientId: "38q2wmxsng5k7gdbj5vyq8t6",
				accessToken: accessToken,
				userId: user_id
			});
		}
	}
});

server.route({
	path: "/static/{path*}",
	method: "GET",
	handler: {
		directory: {
			path: "./public",
			listing: false,
			index: false
		}
	}
});

server.route({
	path: "/beats-randomizer/randomize",
	method: "GET",
	handler: function(request, reply) {
		var user_id = request.session.user.profile.id;
        randomizer.randomize(user_id, function(json) {
        	reply(json);
        });
	}
});


server.route({
	path: "/beats-randomizer/like/{id}",
	method: "GET",
	config: {
		auth: "passport",
		handler: function(request, reply) {
			var user_id = request.session.user.profile.id;
			var accessToken = request.session.user.accessToken;
			var track_id = request.params.id
			randomizer.addItem(user_id, track_id, accessToken, function(json) {
				reply(json);
			});
		}
	}
});

server.route({
	path: "/beats-randomizer/dislike/{id}",
	method: "GET",
	config: {
		auth: "passport",
		handler: function(request, reply) {
			var user_id = request.session.user.profile.id;
			var accessToken = request.session.user.accessToken;
			var track_id = request.params.id
			randomizer.removeItem(user_id, track_id, accessToken, function(json) {
				reply(json);
			});
		}
	}
});

server.start(function () {
    console.log("Hapi server started @ ", server.info.uri);
});
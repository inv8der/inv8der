var Hoek = require("hoek");
var BeatsMusicStrategy = require("passport-beatsmusic").Strategy;

var defaults = {
	path: "",
	urls : {
		successRedirect: "/",
		failureRedirect: "/login"
	},
	beatsmusic: {
		// Application-specific options. Leave blank
        clientID: "",
        clientSecret: "",
        callbackURL: ""
    }
}

/*
var successRedirect = defaults.mount + "/", 
	failureRedirect = defaults.mount + "/login";

Object.defineProperties(defaults.urls, {
	"successRedirect" : {
		get: function() {
			return successRedirect;
		}
		set: function(newValue) {
			successRedirect = defaults.mount + newValue
		}
		enumerable : true,
        configurable : true
	},
	"failureRedirect" : {
		get: function() {
			return failureRedirect;
		}
		set: function(newValue) {
			failureRedirect = defaults.mount + newValue
		}
		enumerable : true,
        configurable : true
	}
});
*/

exports.register = function(plugin, options, next) {
	
	var options = Hoek.applyToDefaults(defaults, options);

	plugin.require("travelogue", options, function(err) {
		if (err) throw err;
	});

	var Passport;
	plugin.dependency("travelogue", function(plugin, next) {
		Passport = plugin.plugins.travelogue.passport;
		Passport.use(new BeatsMusicStrategy(options.beatsmusic, function(accessToken, refreshToken, profile, done) {
			var user = {
				accessToken: accessToken,
				refreshToken: refreshToken,
				profile: profile
			}
			return done(null, user);
		}));
		Passport.serializeUser(function (user, done) {
    		done(null, user);
		});
		Passport.deserializeUser(function (obj, done) {
    		done(null, obj);
		});

		next();
	});

	plugin.route({
		path: options.path + "/login",
		method: "GET",
		config: { 
			auth: false,
			handler: function(request, reply) {
        		//var html = '<a href="/auth/beatsmusic">Login with Beats Music</a>';
        		//reply(html);
        		reply().redirect("/auth/beatsmusic");
        	}
		}
	});

	plugin.route({
		path: options.path + "/auth/beatsmusic",
    	method: "GET",
    	config: {
        	auth: false,
        	handler: function (request, reply) {
            	Passport.authenticate("beatsmusic")(request, reply);
        	}
    	}
	});

	plugin.route({
    	path: options.path + "/auth/beatsmusic/callback",
    	method: "GET",
    	config: {
        	auth: false,
        	handler: function (request, reply) {
            	Passport.authenticate("beatsmusic", {
                	failureRedirect: options.urls.failureRedirect,
                	successRedirect: options.urls.successRedirect,
                	failureFlash: true
            	})(request, reply, function() {
                	reply().redirect(options.urls.successRedirect);
            	});
        	}
    	}
	});
};
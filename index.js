var Hapi = require('hapi');
var Wreck = require('wreck');

var port = Number(process.env.PORT || 5000);
var server = new Hapi.Server(port, {cors: true});

var api = {
    md5crack: { 
        key: '3310f3cf0b86b9103f05dae7',
        baseURL: 'http://api.md5crack.com/'
    },
    md5online: {
        key: '7788205158896745',
        baseURL: 'http://www.md5online.org/api.php'
    }
}

server.route({
	path: '/',
	method: 'GET',
	config: {
        cors: false,
		handler: function(request, reply) {
			reply.redirect('http://randomizr.herokuapp.com/');
		}
	}
});

server.route({
    path: '/resume_cube/{path*}',
    method: 'GET',
    config: {
        cors: false,
        handler: {
            directory: {
                path: './public/resume_cube/',
                listing: false,
                index: false
            }
        }
    }
});

server.route({
	path: '/md5crack/{hash}',
	method: 'GET',
	config: {
		handler: function(request, reply) {
            var url = api.md5crack.baseURL + '/crack/' + api.md5crack.key + '/' + request.params.hash
			Wreck.get(url, {json: true}, function(err, response, payload) {
                if (err) throw err;
                reply(payload);
            });
		}
	}
});

server.route({
    path: '/md5decrypt/{hash}',
    method: 'GET',
    config: {
        handler: function(request, reply) {
            var url = api.md5online.baseURL + '?p=' + api.md5online.key + '&h=' + request.params.hash
            Wreck.get(url, function(err, response, payload) {
                if (err) throw err;
                reply(payload);
            });
        }
    }
});

server.start(function () {
    console.log("Hapi server started @ ", server.info.uri);
});
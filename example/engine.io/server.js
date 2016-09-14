var http = require('http');
var engine = require('engine.io-stream');
var ecstatic = require('ecstatic')(__dirname + '/static');
var dnode = require('../../');

var server = http.createServer(ecstatic);
server.listen(9999);

var engine = engine(function (stream) {
    var d = dnode({
        transform : function (s, cb) {
        	console.log(s);
            var res = s.replace(/[aeiou]{2,}/, 'oo').toUpperCase();
            cb(res);
        }
    });
    d.pipe(stream).pipe(d);
});
engine.attach(server, '/engineio');

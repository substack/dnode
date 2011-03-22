// this file is super kludge
var fs = require('fs');
var path = require('path');

var files = [ 'json2.js', 'compat.js', 'traverse.js', 'events.js', 'dnode.js', '../scrubber.js' ]
    .map(function (file) {
        return fs.readFileSync(__dirname + '/web/' + file)
            .toString()
            .replace(/^module\..*/mg, '')
            .replace(/^var \S+\s*=\s*require\(.*\)[^;\n]*/mg, '')
    });

var socketIO = require('./web/socket_io');
socketIO(function () {}); // cache it

exports.route = function (p) {
    return function (req, res, next) {
        if (p === undefined || req.url === p) {
            res.writeHead(200, { 'Content-Type' : 'text/javascript' });
            socketIO(function (buf) {
                files.forEach(function (src) { res.write(src) });
                res.write(buf);
                res.end();
            });
        }
        else if (next) next();
    };
};

// Cat together all the web files together to make deployment easier.
exports.source = function () {
    console.error(
        "require('dnode/web').source() has been removed."
        + "Use require('dnode/web').route() instead if you must,"
        + "or preferably just use connect or express and you get a"
        + "/dnode.js route for free."
    );
    throw new Error('source() was removed');
};


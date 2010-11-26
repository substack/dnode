var net = require('net');
var http = require('http');
var connect = require('connect');
var EventEmitter = require('events').EventEmitter;

var io = require('socket.io');
var Traverse = require('traverse');

var Conn = require('./conn');
var StreamSocketIO = require('./stream_socketio');

module.exports = DNode;
module.exports.DNode = DNode;

DNode.prototype = new EventEmitter;
function DNode (wrapper) {
    if (!(this instanceof DNode)) return new DNode(wrapper);
    if (wrapper === undefined) wrapper = {};
    var self = this;
    
    /*
        this is a clever method of parsing the arguments. 
        I want to move it into another module so it can be tested
        and it's behaviour made absolutely clear.
        
        -Dominic
    */
    function firstTypes (args) {
        var args = [].concat.apply([],args);
        return args.reduce(function (types, arg) {
            if (arg instanceof http.Server) {
                types['http.Server'] = arg;
            }
            else if (arg instanceof net.Server) {
                types['net.Server'] = arg;
            }
            else if (arg instanceof net.Stream) {
                types['net.Stream'] = arg;
            }
            else if (arg instanceof io.Listener) {
                types['io.Listener'] = arg;
            }
            else {
                types[typeof arg] = arg;
            }
            return types;
        }, {});
    }
    
    self.connect = function () {
        var types = firstTypes(arguments) || {};
        var kwargs = types.object || {};
        var stream = types['net.Stream'];
        var host, port;
        if (parseInt(types.string)) {
            port = parseInt(types.string);
            host = kwargs.host;
        } else {
            host = types.string || kwargs.host;
            port = types.number || kwargs.port;
        }
        var block = types['function'] || kwargs.block;
        
        if (port) {
            stream = net.createConnection(port, host);
            stream.remoteAddress = host || '127.0.0.1';
            stream.remotePort = port;
        }
        
        var conn = self.withStream(stream, kwargs, block);
        stream.on('error', conn.emit.bind(conn, 'localError'));
        
        self.end = function () {
            stream.close();
            self.emit('end');
        };
        
        return self;
    };

    var ready = false;

    var conns = [];
    
    self.withStream = function (stream, opts, block) {
        if (!ready) self.emit('ready');
        ready = true;
        
        var conn = new Conn(stream, wrapper);
        
        conn.on('remote', function (remote) {
            if (block) {
                block.call(conn.instance, remote, conn);
                if (opts.ping) pingInterval(conn, opts.ping, opts.timeout);
            }
        });
        
        conn.on('localError',function(err) {
            //required behaviour for test/asynct/error.asynct.js
            self.emit('localError',err);
        });
        conn.on('remoteError',function(err) {
            //required behaviour for test/asynct/error.asynct.js
            self.emit('remoteError',err);
        });
        
        conn.on('connect', function () { 
            conns.push(conn) 
            self.emit('connect', conn);
        });
        
        conn.on('end', function () {
            var i = conns.indexOf(conn);
            if (i >= 0) conns.splice(i,1);
        });
        
        return conn;
    }
    
    self.end = function () {
        self.emit('error', '.end() is not defined for this action');
    };
    
    self.listen = function () {
        var types = firstTypes(arguments) || {};
        var kwargs = types.object || {};
        var server = kwargs.server
            || types['http.Server']
            || types['net.Server']
            || types['io.Listener']
            || null;

        var host, port;
        if (parseInt(types.string)) {
            port = parseInt(types.string);
            host = kwargs.host;
        } else {
            host = types.string || kwargs.host;
            port = types.number || kwargs.port;
        }
        var block = types['function'] || kwargs.block;
        
        if (server instanceof io.Listener) {
            var stream = StreamSocketIO(function (stream) {
                self.withStream(stream, kwargs, block);
            });
        }
        else if (server instanceof http.Server) {
            // http server to proxy socketIO connections with
            delete kwargs.server;
            var opts = Traverse(kwargs).copy;
            delete kwargs.protocol;
            
            if (server instanceof connect.Server) {
                if (!('route' in kwargs) || kwargs.route) {
                    server.use(require('dnode/web').route(
                        kwargs.route || '/dnode.js'
                    ));
                }
            }
            delete kwargs.route;
            
            var sock = io.listen(server, kwargs);
            
            StreamSocketIO(sock, function (stream) {
                self.withStream(stream, opts, block);
            });
            ready = true;
            self.emit('ready');
        }
        else if (port) {
            server = net.createServer(function (stream) {
                self.withStream(stream, kwargs, block);
            });
            server.on('error', self.emit.bind(self, 'localError'))
            server.listen(port, host, function () {
                ready = true;
                self.emit('ready')
            });
        }
        else {
            throw "Not sure how to fire up this listener";
        }
        
        self.end = function () {
            conns.forEach(function (conn) { conn.end() });
            server.close();
            self.emit('end');
        };
        
        self.close = self.end;
        
        return self;
    };

    // Create an interval `ping` in milliseconds to ping the remote
    // and emit a "timeout" event when a ping hasn't been received for `timeout`
    // millseconds.
    function pingInterval (conn, ping, timeout) {
        var pinger = null;
        pinger = setTimeout(function f () {
            var sent = Date.now();
            var t = null;
            if (timeout) {
                t = setTimeout(
                    function () { conn.emit('timeout') },
                    timeout
                );
            }
            
            conn.sendRequest('ping', [ function () {
                var elapsed = Date.now() - sent;
                conn.emit('ping', elapsed);
                if (t) clearTimeout(t);
                // setTimeout so they don't stack up
                pinger = setTimeout(f, ping);
            } ]);
        }, ping);
        
        conn.on('end', function () {
            clearTimeout(pinger);
        });
    }
    
    return self;
}

// So DNode.connect and DNode().connect do the same thing:
DNode.connect = function () {
    var dnode = DNode();
    return dnode.connect.apply(dnode,[].concat.apply([],arguments));
};

// wrapper to turn synchronous functions into asynchronous ones with the
// result callback inserted as the last argument
DNode.sync = function (f) {
    return function () {
        var args = [].concat.apply([],arguments);
        var argv = args.slice(0,-1);
        var cb = args.slice(-1)[0];
        cb(f.apply(this,argv));
    };
};

// Expose prototype methods so DNode can get at them
DNode.expose = function (obj, name) {
    obj[name] = function () {
        var args = [].slice.call(arguments);
        return obj.constructor.prototype[name].apply(obj, args);
    };
};

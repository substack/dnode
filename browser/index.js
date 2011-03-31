var protocol = require('dnode-protocol');
var EventEmitter = require('events').EventEmitter;
var io = require('dnode/socket.io').io;

var exports = module.exports = dnode;

function dnode (wrapper) {
    if (!(this instanceof dnode)) return new dnode(wrapper);
    this.proto = protocol(wrapper);
    this.stack = [];
    return this;
}

dnode.prototype = new EventEmitter;

dnode.prototype.use = function (middleware) {
    this.stack.push(middleware);
    return this;
};

dnode.prototype.connect = function () {
    var self = this;
    var params = protocol.parseArgs(arguments);
    var client = self.proto.create();
    
    if (!params.port) params.port = parseInt(window.location.port, 10);
    if (isNaN(params.port)) delete params.port;
    var sock = client.socketio = new io.Socket(
        params.host || window.location.hostname,
        params
    );
    
    client.end = function () {
        sock.disconnect();
    };
    
    sock.on('connect', function () {
        client.start();
        self.emit('connect');
    });
    
    sock.on('disconnect', function () {
        self.emit('end');
    });
    
    sock.on('message', client.parse);
    
    client.on('request', function (req) {
        sock.send(JSON.stringify(req) + '\n');
    });
    
    if (params.block) {
        client.on('remote', function () {
            params.block.call(client.instance, client.remote, client);
        });
    }
    
    this.stack.forEach(function (middleware) {
        middleware.call(client.instance, client.remote, client);
    });
    
    sock.connect();
};

exports.connect = function () {
    var d = exports();
    return d.connect.apply(d, arguments);
};

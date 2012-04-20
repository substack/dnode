var protocol = require('dnode-protocol');
var EventEmitter = require('events').EventEmitter;
var io = require('socket.io-client');
var json = typeof JSON === 'object' ? JSON : require('jsonify');
var cached;
var callbackList;

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
    
    if (cached) {
        return params.block && 
            params.block.call(cached.instance, cached.client, cached);
    } else if (callbackList) {
        return callbackList.push(params.block)
    }

    callbackList = [params.block];
    
    var client = self.proto.create();

    var proto = (params.proto || window.location.protocol)
        .replace(/:.*/, '') + '://';
    
    var sock = client.socketio = io.connect(
        proto + (params.host || window.location.host),
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
        client.emit('end');
        self.emit('end');
    });
    
    sock.on('message', client.parse);
    
    client.on('request', function (req) {
        sock.send(json.stringify(req) + '\n');
    });
    
    client.on('remote', function () {
        cached = client;
        var queue = callbackList;
        callbackList = null;
        for (var key in queue) {
            var block = queue[key];
            block.call(client.instance, client.remote, client);
        }
    });
    
    this.stack.forEach(function (middleware) {
        middleware.call(client.instance, client.remote, client);
    });
};

exports.connect = function () {
    var d = exports();
    return d.connect.apply(d, arguments);
};

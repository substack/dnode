var dnode = require('../../');
var net = require('net');
var inject = require('reconnect-core');

var reconnect = inject(function() {
  return net.connect.apply(null, arguments);
  // End this every second.
});

reconnect({}, function(net) {
    net.on('error', function(err) {
      console.log(err);
    });

    // Initialize dnode.
    var d = dnode();
    net.pipe(d).pipe(net);

    d.on('remote', function (remote) {
        console.log("Connected to dnode server");
        remote.transform('beep', function (s) {
            console.log('beep => ' + s);
        });
    });

    setTimeout(function(){console.log('closing dnode'); d.end();}, 2000);
})
.on('reconnect', function(n) { console.log("\n\nreconnecting...\n"); })
.on('error', function(err) { console.log("reconnect error", err); })
.connect(5004);

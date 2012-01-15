#! node --expose-gc
var dnode = require('../');
var test = require('tap').test;
var weak = require('weak');

test('gc', function (t) {
    t.plan(2);
    var port = Math.floor(Math.random() * 40000 + 10000);
    
    var gcLoopIterations = 0;
    var server_ok = false, client_ok = false;

    function forced_gc_loop() {
        gc();
        if (++gcLoopIterations < 50) {
            setTimeout(forced_gc_loop, 100);
        } else {
            if (!server_ok || !client_ok) t.end();
            setTimeout(function() {
                process.exit();
            }, 1000);
        }
    }
    forced_gc_loop();
    
    function onSuccess() {
        t.end();
        setTimeout(process.exit, 500);
    }
    
    var server = dnode({
        callMeBack : function (fn) {
            fn('calling back!');
            weak(fn, function() {
                t.ok(true);
                server_ok = true;
                if (client_ok) onSuccess();
            });
        }
    }).listen(port);
    
    server.on('ready', function () {
        dnode.connect(port, function (remote, conn) {
            function weakCb() {
                t.ok(true);
                client_ok = true;
                if (server_ok) onSuccess();
            }
            (function() {
                var cb = function(){};
                remote.callMeBack(cb);
                weak(cb, weakCb);
            })();
        });
    });
});

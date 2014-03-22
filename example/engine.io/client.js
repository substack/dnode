var domready = require('domready');
var engine = require('engine.io-stream');
var dnode = require('../../');

domready(function () {
    var result = document.getElementById('result');
    var stream = new engine('/engineio');
    
    var d = dnode();
    d.on('remote', function (remote) {
        remote.transform('beep', function (s) {
            result.textContent = 'beep => ' + s;
        });
    });
    d.pipe(stream).pipe(d);
});

var dnode = require('../../');
var d = dnode().connect(7070);
var total = 0
var count = 0

d.on('remote', function fn (remote) {
    var time = Date.now();

    remote.zing(33, function () {
      count++;
      total += Date.now() - time;
      fn(remote);
    });
});

setInterval(function () {
  console.info(total/count);
  total = 0;
  count = 0;
}, 1000)

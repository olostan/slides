var connect = require('connect');

var oneDay = 86400000;
//var oneDay = 10;

var port = process.env.PORT || 3000;

connect(
  connect.static(__dirname + '/public', { maxAge: oneDay })
).listen(port);
console.log("Listening on ",port);
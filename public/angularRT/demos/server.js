var connect = require('connect');
var port = process.env.PORT || 3333;
var http = require('http');
var io = require('socket.io');


var c = connect();
var ip;
c.use(connect.static('./public/angularRT/demos'));
c.use(connect.directory('./public/angularRT/demos/'));
c.use(function (req, res, next) {
    console.log(res.end);
    if (req.url == '/ip.json') {
        res.setHeader('Content-Type', 'application/json');
        res.end('{ "ip": "' + ip + '","port":"' + port + '" }');
    } else
        next();
})
var server = http.createServer(c);

var socket = io.listen(server);

var user = { name: "Valentyn"};

var interfaces = require('os').networkInterfaces();
for (var ifName in interfaces) {
    var i = interfaces[ifName];
    i.forEach(function (r) {
        if (r.family == 'IPv4' && r.address.substr(0, 3) != '127') {
            ip = r.address;

        }
    })
}

socket.on('connection', function (client) {
    //client.on('message', function(message) {console.log(message)});
    //client.on('disconnect', function() {});
    var user = { id: client.id, name: client.id };
    client.set('user', user, function () {
        client.broadcast.emit("user:new", user);
        client.emit('user', user);
        client.on('user:change', function (data) {
            client.broadcast.emit('user:change', {id: client.id, user: data});
        });
    })
    client.on('disconnect', function() {
        client.broadcast.emit('user:leave', {id: client.id})
    })
});

server.listen(port);
console.log("Listening on ", port);
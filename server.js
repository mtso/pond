// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var server = require('http').Server(app);
var socket = require('socket.io');
var io = socket(server);

var listener = server.listen(process.env.PORT, function() {
  console.log('Listening on', listener.address().port);
});

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', function(socket) {  
  socket.on('tap', function(data) {
    var location = data.location;
    socket.broadcast.emit('tap', {location});
  });
});

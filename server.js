var Game = require('./game.js');

var app = require('http').createServer(handler),
    io = require('socket.io').listen(app, {log: false}),
    fs = require('fs'),
    game = new Game(io.sockets);

app.listen(8080);

function handler (req, res) {
   fs.readFile(__dirname + '/index.html',
   function (err, data) {
      if (err) {
         res.writeHead(500);
         return res.end('Error loading index.html');
      }
   res.writeHead(200);
   res.end(data);
   });
}

io.sockets.on('connection', function(socket) {
   
   socket.on('add player', function(data) {
      game.addPlayer(socket);
   }); 

   socket.on('move', function(data) {
      game.playerMoved(this.id, data);
   });

   socket.on('disconnect', function() {
      game.removePlayer(this.id);
   });
});

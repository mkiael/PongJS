var Player = require('./player.js');
var Ball = require('./ball.js');

function Game(sockets) {
   this.sockets = sockets;
   this.screenSize = {w: 640, h: 480};
   this.serveDir = 0;
   this.score = {player1: 0, player2: 0};
   this.ball;
   this.player1;
   this.player2;
   this.interval;
}

Game.prototype.addPlayer = function(socket) {
   if (!this.player1) {
      this.player1 = new Player(socket);
   }
   else if (!this.player2) {
      this.player2 = new Player(socket);
   }
   
   if (this.player1 && this.player2) {
      this.initGame();
      this.startGame();
   }
}

Game.prototype.initGame = function() {
   this.player1.pos = {x: this.screenSize.w*0.1, y: this.screenSize.h*0.5};
   this.player2.pos = {x: this.screenSize.w*0.9, y: this.screenSize.h*0.5};
   this.player1.addOpponent(this.player2);
   this.player2.addOpponent(this.player1);
   this.initBall();
   this.player1.init();
   this.player2.init();
}

Game.prototype.startGame = function() {
   this.score.player1 = 0;
   this.score.player2 = 0;
   this.sockets.emit('update score', this.score);

   var that = this;
   this.interval = setInterval(function() {
      that.run();
   }, 10);
}

Game.prototype.initBall = function() {
   this.ball = new Ball({x: this.screenSize.w*0.5, y: this.screenSize.h*0.5}, this.screenSize);
   this.ball.initVelocity();
   // Broadcast to all connected sockets that a
   // ball has been added.
   this.sockets.emit('add ball', {size: this.ball.size, pos: this.ball.pos});
}

Game.prototype.run = function() {
   this.ball.checkCollision(this.player1, this.player2);
   this.ball.update();
   this.sockets.emit('ball moved', this.ball.pos);
   if (this.ball.isGameOver()) {
      if (this.ball.pos.x < this.screenSize.w/2) {
         // Player 1 loss
         this.score.player2 += 1;
      }
      else {
         // Player 2 loss
         this.score.player1 += 1;
      }
      this.sockets.emit('update score', this.score);
      this.initGame();
   }
}

Game.prototype.playerMoved = function(id, pos) {
   if (this.player1.so.id == id) {
      this.player1.pos = pos;
      this.player2.so.emit('opponent moved', this.player1.pos);
   }
   else if (this.player2.so.id == id) {
      this.player2.pos = pos;
      this.player1.so.emit('opponent moved', this.player2.pos);
   }
}

Game.prototype.removePlayer = function(id) {
   if (this.player1 && this.player1.so.id == id) {
      delete this.player1;
   }
   else if (this.player2 && this.player2.so.id == id) {
      delete this.player2;
   }

   clearInterval(this.interval);
   
   delete this.ball;
}

module.exports = Game;

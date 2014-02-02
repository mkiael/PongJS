function Ball(initPos, screenSize) {
   this.pos = initPos;
   this.screenSize = screenSize;
   this.size = {w: 10, h: 10};
   this.speed = 3;
   this.velocity = {x: this.speed, y: 0};
   this.gameOver = false;
}

Ball.prototype.initVelocity = function() {
   
   var quadrant = Math.floor(Math.random()*4);
   var angle = Math.floor(Math.random()*46)*Math.PI/180.0;
   var cosAngle = Math.cos(angle)*this.speed;
   var sinAngle = Math.sin(angle)*this.speed;

   switch (quadrant) {
   case 0:
      this.velocity.x = cosAngle;
      this.velocity.y = sinAngle;
      break;
   case 1:
      this.velocity.x = -cosAngle;
      this.velocity.y = sinAngle;
      break;
   case 2:
      this.velocity.x = -cosAngle;
      this.velocity.y = -sinAngle;
      break;
   case 3:
      this.velocity.x = cosAngle;
      this.velocity.y = -sinAngle;
      break;
   default:
      break;
   }
}

Ball.prototype.update = function() {
   this.pos.x += this.velocity.x;
   this.pos.y += this.velocity.y;
}

Ball.prototype.getBorder = function() {
   return {leftX: this.pos.x-this.size.w/2,
           rightX: this.pos.x+this.size.w/2,
           topY: this.pos.y-this.size.h/2,
           bottomY: this.pos.y+this.size.h/2};
}

// Calculates a deflection angle from the paddle and returns a new velocity.
Ball.prototype.calcNewVelocity = function(player) {
   var halfPaddleHeight = player.size.h/2;
   var ballToPaddle = this.pos.y-player.getBorder().topY;
   var interRatio = ballToPaddle/halfPaddleHeight;
   var defAngle;
   var upOrDown;

   if (interRatio <= 1.0) {
      // We are in the upper half od the paddle
      interRatio = 1.0 - interRatio;
      upOrDown = -1; // negative sin to get upward
   }
   else if (interRatio > 1.0) {
      // We are in the lower half of the paddle
      interRatio = interRatio - 1.0;
      upOrDown = 1; // positive sin to get downward
   }

   defAngle = (interRatio*75.0)*Math.PI/180.0;
   
   return {x: Math.cos(defAngle)*this.speed,
           y: Math.sin(defAngle)*upOrDown*this.speed};
}

Ball.prototype.checkCollision = function(player1, player2) {
   if (!player1 || !player2) return;

   var ballBorder = this.getBorder();
   var player1Border = player1.getBorder();
   var player2Border = player2.getBorder();

   if (ballBorder.leftX <= player1Border.rightX &&
       ballBorder.rightX >= player1Border.leftX &&
       ballBorder.bottomY > player1Border.topY &&
       ballBorder.topY < player1Border.bottomY) {
      // The ball has hit player1's paddle
      this.velocity = this.calcNewVelocity(player1);
   }
   else if (ballBorder.rightX >= player2Border.leftX &&
            ballBorder.leftX <= player2Border.rightX &&
            ballBorder.bottomY > player2Border.topY &&
            ballBorder.topY < player2Border.bottomY) {
      // The ball has hit player2's paddle
      this.velocity = this.calcNewVelocity(player2);
      this.velocity.x *= -1;
   }
   else if (ballBorder.topY <= 0 ||
            ballBorder.bottomY >= this.screenSize.h) {
     this.velocity.y = -this.velocity.y; 
   }
   else if (ballBorder.leftX <= 0 ||
            ballBorder.rightX >= this.screenSize.w) { 
      this.gameOver = true;
   }
}

Ball.prototype.isGameOver = function() {
   return this.gameOver;
}

module.exports = Ball;

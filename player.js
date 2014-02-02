function Player(so) {
   this.so = so;
   this.size = {w: 10, h: 100};
   this.pos;
}

Player.prototype.init = function() {
   this.so.emit('init', {size: this.size, pos: this.pos});
}

Player.prototype.addOpponent = function(opponent) {
   this.so.emit('add opponent', {size: opponent.size, pos: opponent.pos});
}

Player.prototype.getBorder = function() {
   return {leftX: this.pos.x-this.size.w/2,
           rightX: this.pos.x+this.size.w/2,
           topY: this.pos.y-this.size.h/2,
           bottomY: this.pos.y+this.size.h/2};
}

module.exports = Player;

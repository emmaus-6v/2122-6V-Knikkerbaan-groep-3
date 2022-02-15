class Balletje {
  x;
  y;
  vx;
  vy;
  collide;

  constructor() {
    this.x = 150;
    this.y = -10;
    this.dx = 0;
    this.dy = 0.5;
  }

  move() {
    if(this.y < 30) {
      this.y += this.dy;
      this.dy += 0.02;
    }
  }

  show() {
    fill(0,0,0);
    circle(this.x, this.y, 13);
  }

  checkCollide(balletjes) {
    balletjes.forEach(balletje => {
      // alert("H");
    });
  }

}
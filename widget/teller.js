class Teller {
  x;
  y;
  aantal;

  constructor(_x, _y) {
    this.x = _x;
    this.y = _y;
    this.aantal = 0;
  }

  show() {
    noStroke();
    fill(255, 255, 255);
    textSize(14);
    // print aantal knikkers bovenin
    text(this.aantal.toString(), this.x, this.y);
  }
}
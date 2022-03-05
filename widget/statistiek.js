class Statistiek {
  waarde;
  naam;
  y;

  constructor(_naam, _y) {
    this.waarde = "";
    this.naam = _naam;
    this.y = _y;
  }

  show() {
    push();
      stroke(255);
      strokeWeight(2);
      noFill();
      rect(325, this.y, 100, 70);
      noStroke();
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(10)
      text(this.naam, 375, this.y + 18);
      textSize(25);
      text(this.waarde, 375, this.y + 48);
    pop();
  }
  
}
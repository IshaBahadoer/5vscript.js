let restartButton;
let brug, canvas, raster, eve, alice, bob, bommen;
const numBommen = 5;

class Raster {
  constructor(r, k) {
    this.aantalRijen = r;
    this.aantalKolommen = k;
    this.celGrootte = null;
    this.oranjeRegel = r;
  }

  berekenCelGrootte() {
    this.celGrootte = canvas.width / this.aantalKolommen;
  }

  teken() {
    push();
    noFill();
    stroke('grey');
    for (let rij = 0; rij < this.aantalRijen; rij++) {
      for (let kolom = 0; kolom < this.aantalKolommen; kolom++) {
        if (rij === this.oranjeRegel - 3 || kolom === this.oranjeRegel - 12) {
          fill('orange');
        } else {
          noFill();
        }
        rect(kolom * this.celGrootte, rij * this.celGrootte, this.celGrootte, this.celGrootte);
      }
    }
    pop();
  }
}

class Appel {
  constructor() {
    this.x = 100;
    this.y = 100;
  }
}

class Bom {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.exploded = false;
  }

  explode() {
    // Voeg hier code toe om de explosie-animatie uit te voeren, bijvoorbeeld een rode kleur of een explosieafbeelding.
    this.exploded = true;
  }

  toon() {
    if (!this.exploded) {
      // Toon hier de bom, bijvoorbeeld een zwarte cirkel.
      fill('black');
      ellipse(this.x + raster.celGrootte / 2, this.y + raster.celGrootte / 2, raster.celGrootte, raster.celGrootte);
    }
  }
}

class Jos {
  constructor() {
    this.x = 400;
    this.y = 300;
    this.animatie = [];
    this.frameNummer = 3;
    this.stapGrootte = null;
    this.gehaald = false;
  }

  beweeg() {
    if (keyIsDown(65)) {
      this.x -= this.stapGrootte;
      this.frameNummer = 2;
    }
    if (keyIsDown(68)) {
      this.x += this.stapGrootte;
      this.frameNummer = 1;
    }
    if (keyIsDown(87)) {
      this.y -= this.stapGrootte;
      this.frameNummer = 4;
    }
    if (keyIsDown(83)) {
      this.y += this.stapGrootte;
      this.frameNummer = 5;
    }

    this.x = constrain(this.x, 0, canvas.width);
    this.y = constrain(this.y, 0, canvas.height - raster.celGrootte);

    if (this.x == canvas.width) {
      this.gehaald = true;
    }
  }

  wordtGeraakt(vijand) {
    return this.x === vijand.x && this.y === vijand.y;
  }

  toon() {
    image(this.animatie[this.frameNummer], this.x, this.y, raster.celGrootte, raster.celGrootte);
  }
}

class Vijand {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = null;
    this.stapGrootte = null;
  }

  beweeg() {
    this.x += floor(random(-1, 2)) * this.stapGrootte;
    this.y += floor(random(-1, 2)) * this.stapGrootte;

    this.x = constrain(this.x, 0, canvas.width - raster.celGrootte);
    this.y = constrain(this.y, 0, canvas.height - raster.celGrootte);
  }

  toon() {
    image(this.sprite, this.x, this.y, raster.celGrootte, raster.celGrootte);
  }
}

function preload() {
  brug = loadImage("images/backgrounds/dame_op_brug_1800.jpg");
}

function setup() {
  canvas = createCanvas(900, 600);
  canvas.parent();
  frameRate(10);
  textFont("Verdana");
  textSize(90);

  raster = new Raster(12, 18);
  raster.berekenCelGrootte();

  eve = new Jos();
  eve.stapGrootte = 1 * raster.celGrootte;
  for (let b = 0; b < 6; b++) {
    const frameEve = loadImage("images/sprites/Eve100px/Eve_" + b + ".png");
    eve.animatie.push(frameEve);
  }

  alice = new Vijand(700, 200);
  alice.stapGrootte = 1 * eve.stapGrootte;
  alice.sprite = loadImage("images/sprites/Alice100px/Alice.png");

  bob = new Vijand(600, 400);
  bob.stapGrootte = 1 * eve.stapGrootte;
  bob.sprite = loadImage("images/sprites/Bob100px/Bob.png");

  bommen = [];
  genereerBommen();

  restartButton = createButton('Restart');
  restartButton.position(10, 10);
  restartButton.mousePressed(restartGame);
}

function draw() {
  background(brug);
  raster.teken();
  eve.beweeg();
  alice.beweeg();
  bob.beweeg();

  // Beweeg en toon de bommen
  for (let bom of bommen) {
    bom.toon();
  }

  eve.toon();
  alice.toon();
  bob.toon();

  // Controleer of de speler de bom raakt
  for (let bom of bommen) {
    if (eve.wordtGeraakt(bom) && !bom.exploded) {
      verlorenScherm();
    }
  }

  if (eve.gehaald) {
    gewonnenScherm();
  }
}

function verlorenScherm() {
  background('red');
  fill('white');
  textSize(40);
  text("Je hebt verloren, probeer het opnieuw!", 175, 300);
  noLoop();
}

function gewonnenScherm() {
  background('green');
  fill('white');
  text("Je hebt gewonnen!", 175, 300);
  noLoop();
}

function restartGame() {
  loop();
  eve.x = 400;
  eve.y = 300;
  eve.gehaald = false;
  bommen = [];
  genereerBommen();
}

function genereerBommen() {
  for (let i = 0; i < numBommen; i++) {
    bommen.push(new Bom(floor(random(raster.aantalKolommen)) * raster.celGrootte, floor(random(raster.aantalRijen)) * raster.celGrootte));
  }
}

function keyPressed() {
  if (keyCode === 32) {  // Spatiebalk
    restartGame();
  }
}
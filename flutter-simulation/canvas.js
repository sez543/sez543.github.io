var boids = [];

function setup() {
  boids = [];
  createCanvas(innerWidth, innerHeight - parseInt($(".nav").css("height")));
  for (var i = 0; i < 50; i++) {
    boids.push(new boid());
  }
}

function draw() {
  background(0);
  for (var i of boids) {
    i.show();
    i.movement();
    i.alignment(boids);
    i.cohesion(boids);
    i.separation(boids);
  }
}

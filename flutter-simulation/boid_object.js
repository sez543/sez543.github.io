var align_radius = 50;
var cohesion_radius = 100;
var separation_radius = 50;

var alignment_force = 1;
var cohesion_force = 0.1;
var separation_force = 0.3;

var speed = 4;

function boid() {
  this.position = createVector(random(15, width - 15), random(15, height - 15));
  this.velocity = p5.Vector.random2D();
  this.acceleration = createVector();

  this.show = function() {
    fill("#CCCCCC");
    circle(this.position.x, this.position.y, 15);
  };

  this.movement = function() {
    if (this.position.x > width) {
      this.position.x = 0;
    }
    if (this.position.x < 0) {
      this.position.x = width;
    }
    if (this.position.y > height) {
      this.position.y = 0;
    }
    if (this.position.y < 0) {
      this.position.y = height;
    }
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(speed);
    this.acceleration.mult(0);
  };

  this.alignment = function(boids) {
    var closeby = 0;
    var averageVelocity = createVector();
    for (var i of boids) {
      if (
        dist(this.position.x, this.position.y, i.position.x, i.position.y) <
          align_radius &&
        this != i
      ) {
        averageVelocity.add(i.velocity);
        closeby++;
      }
    }
    if (closeby > 0) {
      averageVelocity.div(closeby);
      averageVelocity.setMag(speed);
      averageVelocity.sub(this.velocity);
      averageVelocity.limit(alignment_force);
    }
    averageVelocity.mult(parseFloat($("#alignment").val()));
    this.acceleration.add(averageVelocity);
  };

  this.cohesion = function(boids) {
    var closeby = 0;
    var averagePosition = createVector();
    for (var i of boids) {
      if (
        dist(this.position.x, this.position.y, i.position.x, i.position.y) <
          cohesion_radius &&
        this != i
      ) {
        averagePosition.add(i.position);
        closeby++;
      }
    }
    if (closeby > 0) {
      averagePosition.div(closeby);
      averagePosition.sub(this.position);
      averagePosition.setMag(speed);
      averagePosition.limit(cohesion_force);
    }
    averagePosition.mult(parseFloat($("#cohesion").val()));
    this.acceleration.add(averagePosition);
  };

  this.separation = function(boids) {
    var closeby = 0;
    var OppositeVector = createVector();
    for (var i of boids) {
      var d = dist(
        this.position.x,
        this.position.y,
        i.position.x,
        i.position.y
      );
      if (d < separation_radius && this != i) {
        var diff = p5.Vector.sub(this.position, i.position);
        diff.div(d * d);
        OppositeVector.add(diff);
        closeby++;
      }
    }
    if (closeby > 0) {
      OppositeVector.div(closeby);
      OppositeVector.setMag(speed);
      OppositeVector.sub(this.velocity);
      OppositeVector.limit(separation_force);
    }
    OppositeVector.mult(parseFloat($("#separation").val()));
    this.acceleration.add(OppositeVector);
  };
}

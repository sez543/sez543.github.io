var iterations = 100;
var limit = 16;

var ca = -0.463927;
var cb = -0.556131;

/*
var colorsRed = [];
var colorsGreen = [];
var colorsBlue = [];
*/

var sectionWidth = iterations / 4;

function ColorGradient(arr, start, section, startcolor, endcolor) {
  for (var i = 0; i < section; i++) {
    arr[start + i] = map(i, 0, section, startcolor, endcolor);
  }
}

function setup() {
  createCanvas(innerWidth, innerHeight);
  pixelDensity(1);
  colorMode(HSB, 1);
  loop();

  /*
  for (let n = 0; n < iterations; n++) {
    let hu = sqrt(n / iterations);
    let col = color(hu, 150, 255);
    colorsRed[n] = red(col);
    colorsGreen[n] = green(col);
    colorsBlue[n] = blue(col);
  }
  */

  /*
  ColorGradient(colorsRed, 0, sectionWidth, 0, 0);
  ColorGradient(colorsRed, sectionWidth - 1, sectionWidth, 0, 200);
  ColorGradient(colorsRed, sectionWidth * 2 - 1, sectionWidth, 200, 255);
  ColorGradient(colorsRed, sectionWidth * 3 - 1, sectionWidth, 255, 0);

  ColorGradient(colorsGreen, 0, sectionWidth, 0, 0);
  ColorGradient(colorsGreen, sectionWidth - 1, sectionWidth, 0, 200);
  ColorGradient(colorsGreen, sectionWidth * 2 - 1, sectionWidth, 200, 200);
  ColorGradient(colorsGreen, sectionWidth * 3 - 1, sectionWidth, 200, 0);

  ColorGradient(colorsBlue, 0, sectionWidth, 128, 255);
  ColorGradient(colorsBlue, sectionWidth - 1, sectionWidth, 255, 200);
  ColorGradient(colorsBlue, sectionWidth * 2 - 1, sectionWidth, 200, 0);
  ColorGradient(colorsBlue, sectionWidth * 3 - 1, sectionWidth, 0, 0);
  */
}

$(".button-draw").click(function () {
  ca = parseFloat($(".real").val());
  cb = parseFloat($(".imaginary").val());
  loop();
});

$(".button-download").click(function () {
  saveCanvas("myCanvas", "jpg");
});

function draw() {
  console.log(ca, cb);
  loadPixels();
  for (var i = 0; i < width; i++) {
    for (var j = 0; j < height; j++) {
      var a = map(i, 0, width, -3, 3);
      var b = map(j, 0, height, -1.5, 1.5);
      //var ca = map(mouseX, 0, width, -2, 2);
      //var cb = map(mouseY, 0, height, -2, 2);
      var nf = Mandelbrot(ca, cb, a, b);

      var color = 255 - Math.round((nf * 255) / iterations);
      var pix = (i + j * width) * 4;
      pixels[pix + 0] = color;
      pixels[pix + 1] = color;
      pixels[pix + 2] = color;
      pixels[pix + 3] = 255;

      /*
      var pix = (i + j * width) * 4;
      if (nf == iterations) {
        pixels[pix + 0] = 0;
        pixels[pix + 1] = 0;
        pixels[pix + 2] = 0;
        pixels[pix + 3] = 255;
      } else {
        pixels[pix + 0] = colorsRed[nf];
        pixels[pix + 1] = colorsGreen[nf];
        pixels[pix + 2] = colorsBlue[nf];
        pixels[pix + 3] = 255;
      }
      */
    }
  }
  updatePixels();
  noLoop();
}

function complexMult(a, b) {
  var result = [0, 0];
  result[0] = a[0] * b[0] - a[1] * b[1];
  result[1] = a[0] * b[1] + a[1] * b[0];
  return result;
}

function Mandelbrot(x, y, cx, cy) {
  var z = [cx, cy];
  var n = 0;
  while (n < 100) {
    var a = complexMult(z, z)[0] + x;
    var b = complexMult(z, z)[1] + y;
    z[0] = a;
    z[1] = b;
    if (z[0] * z[0] + z[1] * z[1] > limit) {
      return n;
    }
    n++;
  }
  return n;
}

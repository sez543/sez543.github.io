function setup() {
  createCanvas(innerWidth, innerHeight);
  pixelDensity(1);

  loadPixels();
  var iterations = 90;
  var limit = 16;
  for (var i = 0; i < width; i++) {
    for (var j = 0; j < height; j++) {
      var a = map(i, 0, width, -2, 2);
      var b = map(j, 0, height, -1, 1);
      //var nf = Mandelbrot(x, y);

      var nf = 0;
      var ca = a;
      var cb = b;

      while (nf < iterations) {
        var aa = a * a - b * b;
        var bb = 2 * a * b;
        a = aa + ca;
        b = bb + cb;
        if (a * a + b * b > limit) {
          break;
        }
        nf++;
      }

      var color = 255 - Math.round((nf * 255) / iterations);
      var pix = (i + j * width) * 4;
      pixels[pix + 0] = color;
      pixels[pix + 1] = color;
      pixels[pix + 2] = color;
      pixels[pix + 3] = 255;
    }
  }
  updatePixels();
  // saveCanvas("myCanvas", "jpg");
}
function draw() {}

function complexMult(a, b) {
  var result = [0, 0];
  result[0] = a[0] * b[0] - a[1] * b[1];
  result[1] = a[0] * b[1] + a[1] * b[0];
  return result;
}

function Mandelbrot(x, y) {
  var z = [0, 0];
  var n = 0;
  while (n < 100) {
    z[0] = complexMult(z, z)[0] + x;
    z[1] = complexMult(z, z)[1] + y;
    if (z[0] * z[0] + z[1] * z[1] > 16) {
      return n;
    }
    n++;
  }
  return n;
}

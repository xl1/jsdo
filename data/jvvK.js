(function() {
  var ctx;

  console.image = function(img) {
    var image, src;
    if (typeof img === 'string') {
      image = document.createElement('img');
      image.src = img;
      image.onload = function() {
        return console.image(image);
      };
      return;
    }
    if ('canvas' in img) {
      img = img.canvas;
    }
    if (img instanceof HTMLCanvasElement) {
      src = img.toDataURL();
    } else {
      src = img.src;
    }
    return console.log('%c', "background-image: url('" + src + "');\nfont-size: 0;\nline-height: " + img.height + "px;\npadding: " + (img.height / 2) + "px " + img.width + "px " + (img.height / 2) + "px 0;");
  };

  console.qr = function(text, size) {
    if (size == null) {
      size = 128;
    }
    return console.image("http://chart.apis.google.com/chart?chs=" + size + "x" + size + "&cht=qr&chl=" + (encodeURIComponent(text)));
  };

  console.tex = function(text) {
    return console.image("http://chart.apis.google.com/chart?cht=tx&chl=" + (encodeURIComponent(text)));
  };

  console.image('http://placekitten.com/250/100');

  ctx = document.createElement('canvas').getContext('2d');

  ctx.beginPath();

  ctx.moveTo(20, 20);

  ctx.lineTo(280, 130);

  ctx.lineTo(250, 20);

  ctx.lineTo(50, 130);

  ctx.closePath();

  ctx.stroke();

  console.image(ctx);

  console.qr(location.href);

  console.tex('\\lim_{x\\to 0}\\frac{\\sin x}{x} = 1');

}).call(this);

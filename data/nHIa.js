(function() {
  var $, color, ctx, draw, grad, i, img, _i, _len, _ref;

  $ = function(id) {
    return document.getElementById(id);
  };

  ctx = $('canv').getContext('2d');

  img = document.createElement('img');

  img.src = '../assets/GAVxv.jpg';

  grad = ctx.createLinearGradient(0, 0, 256, 0);

  _ref = 'red|yellow|lime|cyan|blue|pink|red'.split('|');
  for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
    color = _ref[i];
    grad.addColorStop(i / 6, color);
  }

  ctx.fillStyle = grad;

  draw = function(gco) {
    ctx.clearRect(0, 0, 256, 384);
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(img, 0, 0);
    ctx.globalCompositeOperation = gco;
    return ctx.fillRect(0, 128, 256, 384);
  };

  img.onload = function() {
    return draw('source-over');
  };

  $('blendmodes').addEventListener('click', function(e) {
    return draw(e.target.textContent);
  }, false);

}).call(this);

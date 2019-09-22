(function() {
  var redraw, scltop, target1, target2;

  (function() {
    var r, _name;
    r = 'equestAnimationFrame';
    return window[_name = 'r' + r] || (window[_name] = window['webkitR' + r] || window['mozR' + r] || function(f) {
      return setTimeout(f, 1000 / 60);
    });
  })();

  target1 = document.getElementById('target1');

  target2 = document.getElementById('target2');

  scltop = function() {
    return document.body.scrollTop + 'px';
  };

  window.addEventListener('scroll', function() {
    return target1.style.top = scltop();
  }, false);

  redraw = function() {
    target2.style.top = scltop();
    return requestAnimationFrame(redraw);
  };

  redraw();

}).call(this);

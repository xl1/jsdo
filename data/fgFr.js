(function() {
  var $, getStyle, log, style, target, _ref;

  $ = function(id) {
    return document.getElementById(id);
  };

  _ref = ['log', 'target', 'target-stylist'].map($), log = _ref[0], target = _ref[1], style = _ref[2];

  getStyle = function() {
    var wt;
    wt = log.firstElementChild;
    return getComputedStyle(target).WebkitTransform.replace(/\W([\d.-]+)/g, function(m, r1) {
      wt.textContent = (+r1 * 10000 | 0) / 10000;
      return wt = wt.nextElementSibling;
    });
  };

  style.addEventListener('keyup', getStyle, false);

  getStyle();

}).call(this);

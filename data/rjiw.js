(function() {
  var key, n, _i, _len, _ref;

  key = function(n, e) {
    var ary, code, div;
    div = document.createElement('div');
    code = e.which || e.keyCode;
    ary = [n, code, String.fromCharCode(code), e.ctrlKey, e.shiftKey, e.altKey];
    div.innerHTML = '<span>' + ary.join('</span><span>') + '</span>';
    return document.body.insertBefore(div, document.body.firstElementChild);
  };

  _ref = ['down', 'press', 'up'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    n = _ref[_i];
    document.addEventListener('key' + n, key.bind(null, n), false);
  }

}).call(this);

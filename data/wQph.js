(function() {
  var evt, form, input, log;

  log = function(txt) {
    return document.body.insertAdjacentHTML('beforeend', "<p>" + txt + "</p>");
  };

  form = document.createElement('form');

  input = document.createElement('input');

  form.appendChild(input);

  form.addEventListener('change', function(e) {
    return log(e.target.tagName);
  }, false);

  evt = document.createEvent('HTMLEvents');

  evt.initEvent('change', true, true);

  input.dispatchEvent(evt);

  document.body.appendChild(form);

  input.dispatchEvent(evt);

}).call(this);

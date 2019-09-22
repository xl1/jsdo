(function() {
  var $, createURL, filterString, rand, style;

  $ = function(id) {
    return document.getElementById(id);
  };

  rand = function() {
    return Math.random() * 10000;
  };

  createURL = function(content) {
    var blob;
    blob = new Blob([content], {
      type: 'text/plain'
    });
    return URL.createObjectURL(blob);
  };

  filterString = (function() {
    var fsURL, vsURL;
    vsURL = createURL($('vshader').textContent);
    fsURL = createURL($('fshader').textContent);
    return function(seed1, seed2) {
      return "custom(\n	url('" + vsURL + "') mix(url('" + fsURL + "') normal source-atop),\n	32 32 detached,\n	seed " + seed1 + " " + seed2 + "\n)";
    };
  })();

  style = document.createElement('style');

  document.head.appendChild(style);

  setInterval(function() {
    return $('ifr').style.WebkitFilter = filterString(rand(), rand());
  }, 2500);

  $('address').addEventListener('change', function() {
    return $('ifr').src = this.value;
  });

}).call(this);

(function() {
  var $text, filter;

  $text = function(id) {
    return document.getElementById(id).textContent;
  };

  filter = (new CustomFilterGL).source('../assets/5NHs1.jpg').shader($text('vshader'), $text('fshader'), true, 'normal', 'source-atop').mesh(16, 16, 'filter-box', true).draw();

  setInterval(function() {
    return filter.uniforms({
      seed: [Date.now() % 3e+4, Date.now() % 12345]
    }).draw();
  }, 2000);

  /*
  custom(
  	url(#vshader) mix(url(#fshader) normal source-atop),
  	16 16 filter-box detached,
  	seed *** ***
  )
  に相当する
  */


}).call(this);

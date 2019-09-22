(function() {
  var gl;

  gl = new MicroGL();

  gl.init(document.getElementById('webgl'));

  gl.program(document.getElementById('vshader').textContent, document.getElementById('fshader').textContent);

  gl.bindVars({
    uSampler: '../assets/cwJhh.jpg',
    uTexSize: [256, 256],
    aPosition: [-1, -1, -1, 1, 1, -1, 1, 1]
  });

  gl.draw();

}).call(this);

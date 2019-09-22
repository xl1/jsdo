(function() {

  new MicroGL().init(document.body).program('attribute vec2 pos;\nvoid main(){\n  gl_Position = vec4(pos, 0.0, 1.0);\n}', 'precision mediump float;\nvoid main(){\n  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n}').bindVars({
    pos: [0, 0, 1, 0, 1, 1]
  }).draw();

}).call(this);

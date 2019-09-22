(function() {
  var fragment, vertex;

  vertex = 'attribute vec2 pos;\nattribute vec3 color;\nvarying vec3 v_color;\nvoid main(){\n    v_color = color;\n    gl_Position = vec4(pos, 0.0, 1.0);\n}';

  fragment = 'precision mediump float;\nvarying vec3 v_color;\nvoid main(){\n    gl_FragColor = vec4(v_color, 1.0);\n}';

  (new MicroGL({
    antialias: false
  })).init(document.body).program(vertex, fragment).bindVars({
    pos: [-1, -1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1],
    color: [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]
  }).draw();

}).call(this);

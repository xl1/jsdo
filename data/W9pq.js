(function() {
  var cos, getShaders, gl, main, sin, startT, update;

  gl = new MicroGL();

  startT = 0;

  cos = Math.cos, sin = Math.sin;

  getShaders = function() {
    var attributes, fshader, gl_FragColor, gl_Position, uniforms, vshader;
    gl_Position = gl_FragColor = null;
    vshader = function(a, u) {
      var mat, pos;
      pos = vec4.createFrom(a.position[0], a.position[1], 0, 1);
      mat = u.modelView;
      mat4.multiply(u.perspective, mat, mat);
      mat4.multiply(mat, pos, gl_Position);
      return {
        texCoord: a.position
      };
    };
    fshader = function(u, v) {
      gl_FragColor = texture2D.create(u.sampler, v.texCoord);
    };
    uniforms = {
      modelView: 'mat4',
      perspective: 'mat4',
      sampler: 'sampler2D'
    };
    attributes = {
      position: 'vec2'
    };
    return [vshader, fshader, uniforms, attributes];
  };

  update = function() {
    var t;
    t = (Date.now() - startT) * 0.003;
    gl.bindVars({
      modelView: [cos(t), 0, -sin(t), 0, 0, 1, 0, 0, sin(t), 0, cos(t), 0, 0, -0.5, 3, 1]
    }).clear().draw();
    return requestAnimationFrame(update);
  };

  main = function() {
    var _ref;
    (_ref = gl.init(document.body, 256, 256)).program.apply(_ref, getShaders()).bindVars({
      position: [0, 0, 0, 1, 1, 0, 1, 1],
      sampler: '../assets/sHjQC.jpg',
      perspective: [2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1.01, 1, 0, 0, -1.01, 0]
    });
    startT = Date.now();
    return update();
  };

  main();

}).call(this);

(function() {
  var constant, frames, fshader, gl, main, modelView, program, startT, update, vshader, xhrget;

  vshader = {
    noop: 'attribute vec2 position;\nvoid main(){ gl_Position = vec4(position, 0.0, 1.0); }',
    main: 'attribute vec3 position;\nattribute vec3 normal;\nuniform mat4 modelView;\nuniform mat4 prevModelView;\nuniform float localTime;\nuniform mat4 perspective;\nvarying vec3 vNormal;\n\nvoid main(){\n  vec4 pos = modelView * vec4(position, 1.0);\n  vec4 ppos = prevModelView * vec4(position, 1.0);\n  gl_Position = perspective * mix(pos, ppos, localTime);\n\n  vec3 nrm = mat3(modelView) * normal;\n  vec3 pnrm = mat3(prevModelView) * normal;\n  vNormal = mix(nrm, pnrm, localTime);\n}'
  };

  fshader = {
    blend: 'precision mediump float;\nuniform sampler2D tex;\nuniform float size;\nvoid main(){\n  gl_FragColor = vec4(texture2D(tex, gl_FragCoord.xy / size).rgb, 0.25);\n}',
    main: 'precision mediump float;\n\nuniform vec3 light;\nvarying vec3 vNormal;\n\nvoid main(){\n  vec3 color = dot(normalize(light), vNormal) * vec3(1.0, 1.0, 0.0);\n  gl_FragColor = vec4(color + vec3(0.1), 1.0);\n}'
  };

  xhrget = function(url, callback) {
    var xhr;
    xhr = new XMLHttpRequest;
    xhr.open('GET', url, true);
    xhr.onload = function() {
      return callback(xhr.responseText);
    };
    return xhr.send(null);
  };

  gl = new MicroGL();

  program = {};

  constant = {};

  frames = [];

  startT = 0;

  modelView = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 30, 1];

  main = function(json) {
    var i, teapot;
    teapot = JSON.parse(json).Teapot01;
    gl.init(document.body).blend('add');
    program.main = gl.makeProgram(vshader.main, fshader.main);
    program.blend = gl.makeProgram(vshader.noop, fshader.blend);
    constant.main = gl.program(program.main).variable({
      position: teapot.position,
      normal: teapot.normal,
      INDEX: teapot.INDEX,
      perspective: [2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1.01, 1, 0, 0, -1.01, 0],
      light: [1, 1, -0.5]
    });
    constant.blend = gl.program(program.blend).variable({
      position: [-1, -1, -1, 1, 1, -1, 1, 1],
      size: gl.width
    });
    frames = (function() {
      var _i, _len, _ref, _results;
      _ref = [0, 1, 2, 3];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        _results.push(gl.frame());
      }
      return _results;
    })();
    updating.addEventListener('change', function() {
      if (this.checked) {
        return update();
      }
    }, false);
    startT = Date.now();
    return update();
  };

  update = function() {
    var frame, i, prevModelView, t, _i, _j, _len, _len1;
    if (!updating.checked) {
      return;
    }
    t = 0.005 * (Date.now() - startT);
    prevModelView = new Float32Array(modelView);
    modelView = [Math.cos(t), 0, -Math.sin(t), 0, 0, 1, 0, 0, Math.sin(t), 0, Math.cos(t), 0, 0, 0, 30, 1];
    gl.gl.enable(gl.gl.DEPTH_TEST);
    gl.blend(false).program(program.main).bind(constant.main).bindVars({
      modelView: modelView,
      prevModelView: prevModelView
    });
    for (i = _i = 0, _len = frames.length; _i < _len; i = ++_i) {
      frame = frames[i];
      gl.bindVars({
        localTime: i / 3
      }).clearFrame(frame).drawFrame(frame);
    }
    gl.gl.disable(gl.gl.DEPTH_TEST);
    gl.blend(true).program(program.blend).bind(constant.blend).clear();
    for (_j = 0, _len1 = frames.length; _j < _len1; _j++) {
      frame = frames[_j];
      gl.bindVars({
        tex: frame.color
      }).draw();
    }
    return requestAnimationFrame(update);
  };

  xhrget('../assets/kvyI0', main);

}).call(this);

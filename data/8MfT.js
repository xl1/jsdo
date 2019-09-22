(function() {
  var constant, depthMap, directionMatrix, fshader, gl, main, modelView, parallel, perspective, program, update, vshader, xhrget;

  vshader = {
    main: 'precision mediump float;\nattribute vec3 position;\nattribute vec3 normal;\nuniform mat4 modelView;\nuniform mat4 perspective;\nuniform mat4 parallel;\nuniform mat3 lightView;\nvarying vec3 normalTransformed;\nvarying vec3 lightCoord;\n\nvoid main(){\n  mat3 modelView3 = mat3(modelView);\n  gl_Position = perspective * modelView * vec4(position, 1.0);\n  lightCoord = (parallel * vec4(lightView * modelView3 * position, 1.0)).xyz;\n  normalTransformed = modelView3 * normal;\n}',
    depth: 'precision mediump float;\nattribute vec3 position;\nuniform mat4 modelView;\nuniform mat4 parallel;\nuniform mat3 lightView;\nvoid main(){\n  gl_Position = parallel * vec4(lightView * mat3(modelView) * position, 1.0);\n}'
  };

  fshader = {
    main: 'precision mediump float;\nuniform sampler2D depthMap;\nuniform mat3 lightView;\nvarying vec3 lightCoord;\nvarying vec3 normalTransformed;\n\nconst vec3 color = vec3(1.0, 1.0, 0.0);\nconst vec3 envLight = vec3(0.1);\nconst vec4 bias = vec4(1.0, 256.0, 65536.0, 16777216.0);\n\nvoid main(){\n  vec3 light = vec3(lightView[0].z, lightView[1].z, lightView[2].z);\n  vec3 ref = 0.5 * lightCoord + vec3(0.5);\n  vec4 depthVec = texture2D(depthMap, ref.xy);\n  float depth = dot(depthVec, 1.0 / bias);\n  float diffuse = ref.z - depth < 0.01\n    ? max(0.0, dot(-light, normalize(normalTransformed)))\n    : 0.0;\n  gl_FragColor = vec4(envLight + diffuse * color, 1.0);\n}',
    wireframe: 'precision mediump float;\nvoid main(){ gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); }',
    depth: 'precision mediump float;\nconst vec4 bias = vec4(1.0, 256.0, 65536.0, 16777216.0);\nvoid main(){\n  vec4 depthVec = fract(gl_FragCoord.z * bias);\n  depthVec -= vec4(depthVec.yzw / 256.0, 0.0);\n  gl_FragColor = depthVec;\n}'
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

  directionMatrix = function(x, y, z) {
    var len, t, _ref;
    len = Math.sqrt(x * x + y * y + z * z);
    _ref = [x / len, y / len, z / len], x = _ref[0], y = _ref[1], z = _ref[2];
    if (y === 1 || y === -1) {
      return [0, y, 0, 0, 0, y, 1, 0, 0];
    } else {
      t = Math.sqrt(1 - y * y);
      return [z / t, -x * y / t, x, 0, t, y, -x / t, -y * z / t, z];
    }
  };

  gl = new MicroGL();

  program = {};

  depthMap = null;

  constant = null;

  parallel = [0.05, 0, 0, 0, 0, 0.05, 0, 0, 0, 0, 0.025, 0, 0, 0, -0.5, 1];

  perspective = [2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1.01, 1, 0, 0, -1.01, 0];

  modelView = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 30, 1];

  main = function(json) {
    var teapot;
    teapot = JSON.parse(json).Teapot01;
    gl.init(document.body, 512, 512);
    program.depth = gl.makeProgram(vshader.depth, fshader.depth);
    program.main = gl.makeProgram(vshader.main, fshader.main);
    program.wireframe = gl.makeProgram(vshader.main, fshader.wireframe);
    constant = gl.program(program.main).variable({
      position: teapot.position,
      normal: teapot.normal,
      INDEX: teapot.INDEX,
      perspective: perspective,
      parallel: parallel,
      lightView: directionMatrix(1, -1, 1)
    });
    depthMap = gl.frame();
    gl.gl.canvas.addEventListener('mousemove', function(e) {
      var rotate, x, y;
      x = e.offsetX / this.offsetWidth - 0.5;
      y = 0.5 - e.offsetY / this.offsetHeight;
      rotate = directionMatrix(x * 3, y * 3, 1);
      return modelView = [rotate[0], rotate[1], rotate[2], 0, rotate[3], rotate[4], rotate[5], 0, rotate[6], rotate[7], rotate[8], 0, 0, 0, 30, 1];
    }, false);
    return update();
  };

  update = function() {
    gl.program(program.depth).bind(constant).bindVars({
      modelView: modelView
    }).clearFrame(depthMap).drawFrame(depthMap).program(program.main).bind(constant).bindVars({
      modelView: modelView,
      depthMap: depthMap.color
    }).clear().draw().program(program.wireframe).bind(constant).bindVars({
      modelView: modelView
    }).draw('LINES');
    return requestAnimationFrame(update);
  };

  xhrget('../assets/kvyI0', main);

}).call(this);

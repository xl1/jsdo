(function() {
  var constant, createSurface, fshader, gl, height, main, mouse, program, refractIndex, size, update, velocity, vshader;

  vshader = {
    main: 'attribute vec2 position;\nuniform mat4 perspective;\nuniform mat4 modelView;\nuniform sampler2D height;\nuniform float index;\nuniform float size;\n\nvarying vec3 v_refF;\nvarying vec3 v_refN;\nvarying float v_F;\n\nfloat ht(float x, float y){\n  vec2 ref = position + vec2(x, y) / size;\n  return texture2D(height, ref).z - 0.5;\n}\nvoid main(){\n  vec4 pos = modelView * vec4(position, ht(0.0, 0.0), 1.0);\n  vec3 normal = normalize(mat3(modelView) * vec3(\n    ht(1.0, 0.0) - ht(-1.0, 0.0),\n    ht(0.0, 1.0) - ht(0.0, -1.0),\n    2.0\n  ));\n  v_refF = reflect(pos.xyz, normal);\n  v_refN = refract(normalize(pos.xyz), normal, 1.0 / index);\n  float f = (index - 1.0) / (index + 1.0);\n  float t = dot(normalize(pos.xyz), normal);\n  v_F = mix(pow(1.0 + t, 5.0), 1.0, f * f);\n\n  gl_Position = perspective * pos;\n}',
    pass: 'attribute vec2 position;\nvoid main(){\n  gl_Position = vec4(position, 0.0, 1.0);\n}',
    background: 'attribute vec3 position;\nattribute vec3 normal;\nvoid main(){\n  gl_Position\n}'
  };

  fshader = {
    main: 'precision mediump float;\nuniform samplerCube texture;\nvarying vec3 v_refF;\nvarying vec3 v_refN;\nvarying float v_F;\n\nvoid main(){\n  gl_FragColor = mix(\n    textureCube(texture, v_refN), textureCube(texture, v_refF), v_F\n  );\n}',
    velocity: 'precision mediump float;\nuniform float size;\nuniform sampler2D velocity;\nuniform sampler2D height;\n\nfloat ht(float x, float y){\n  vec2 ref = (gl_FragCoord.xy + vec2(x, y)) / size;\n  return texture2D(height, ref).z - 0.5;\n}\nfloat vel(){\n  vec2 ref = gl_FragCoord.xy / size;\n  return texture2D(velocity, ref).z - 0.5;\n}\nvoid main(){\n  float result = 0.5 + vel() + 0.04 * (\n    ht(-1.0, 0.0) + ht(0.0, -1.0) +\n    ht(0.0, 1.0) + ht(1.0, 0.0) - 4.0 * ht(0.0, 0.0)\n  );\n  gl_FragColor = vec4(0.0, result, result, 1.0);\n}',
    height: 'precision mediump float;\nuniform vec2 mouse;\nuniform float size;\nuniform sampler2D velocity;\nuniform sampler2D height;\n\nvoid main(){\n  vec2 ref = gl_FragCoord.xy / size;\n  float ht = texture2D(height, ref).z - 0.5;\n  float vel = texture2D(velocity, ref).z - 0.5;\n  float result = distance(mouse, gl_FragCoord.xy) < 1.0\n    ? 1.0\n    : 0.5 + ht + vel;\n  gl_FragColor = vec4(0.0, result, result, 1.0);\n}'
  };

  gl = new MicroGL({
    antialias: true
  });

  mouse = {
    x: 0,
    y: 0
  };

  program = {};

  constant = {};

  velocity = null;

  height = null;

  size = 256;

  refractIndex = 2;

  createSurface = function() {
    var surface, x, y, _i, _j;
    surface = [];
    for (y = _i = 0; _i < size; y = _i += 1) {
      surface.push(0, y / size);
      for (x = _j = 0; _j <= size; x = _j += 1) {
        surface.push(x / size, y / size, x / size, (y + 1) / size);
      }
      surface.push(1, (y + 1) / size);
    }
    return surface;
  };

  main = function(tex) {
    var d;
    gl.init(document.body, size, size);
    program.velocity = gl.makeProgram(vshader.pass, fshader.velocity);
    program.height = gl.makeProgram(vshader.pass, fshader.height);
    program.main = gl.makeProgram(vshader.main, fshader.main);
    d = 1 - 2 / size;
    constant.frame = gl.program(program.height).variable({
      position: [-d, -d, -d, d, d, -d, d, d],
      size: size
    });
    constant.main = gl.program(program.main).variable({
      position: createSurface(),
      perspective: [2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1.01, 1, 0, 0, -1.01, 0],
      modelView: [4, 0, 0, 0, 0, 2, 2 * 1.732, 0, 0, 0.01732, -0.01, 0, -2, -0.3, 1, 1],
      size: size,
      texture: tex
    });
    velocity = gl.frame();
    height = gl.frame();
    gl.program(vshader.pass, 'precision mediump float; void main(){ gl_FragColor = vec4(vec3(.5),1.); }').bindVars({
      position: [-1, -1, -1, 1, 1, -1, 1, 1]
    }).drawFrame(velocity).drawFrame(height);
    gl.gl.canvas.addEventListener('mousemove', function(e) {
      mouse.x = e.offsetX;
      return mouse.y = size - e.offsetY;
    }, false);
    document.getElementById('refract').addEventListener('change', function() {
      return refractIndex = +this.value;
    }, false);
    return update();
  };

  update = function() {
    gl.program(program.velocity).bind(constant.frame).bindVars({
      velocity: velocity.color,
      height: height.color
    }).drawFrame(velocity).program(program.height).bind(constant.frame).bindVars({
      mouse: [mouse.x, mouse.y],
      velocity: velocity.color,
      height: height.color
    }).drawFrame(height).program(program.main).bind(constant.main).bindVars({
      height: height.color,
      index: refractIndex
    }).clear().draw();
    return requestAnimationFrame(update);
  };

  gl.textureCube(['../assets/oEHGT.jpg', '../assets/vVzgp.jpg', '../assets/xAiR1.jpg', '../assets/4Vw7Y.jpg', '../assets/1jrno.jpg', '../assets/e00EY.jpg'], null, main);

}).call(this);

(function() {
  var constant, fshader, gl, height, main, mouse, program, size, update, velocity, vshader;

  vshader = 'attribute vec2 position;\nvoid main(){\n  gl_Position = vec4(position, 0.0, 1.0);\n}';

  fshader = {
    velocity: 'precision mediump float;\nuniform float size;\nuniform sampler2D velocity;\nuniform sampler2D height;\n\nfloat ht(float x, float y){\n  vec2 ref = (gl_FragCoord.xy + vec2(x, y)) / size;\n  return texture2D(height, ref).z - 0.5;\n}\nfloat vel(){\n  vec2 ref = gl_FragCoord.xy / size;\n  return texture2D(velocity, ref).z - 0.5;\n}\nvoid main(){\n  float result = 0.5 + vel() + 0.04 * (\n    ht(-1.0, 0.0) + ht(0.0, -1.0) +\n    ht(0.0, 1.0) + ht(1.0, 0.0) - 4.0 * ht(0.0, 0.0)\n  );\n  gl_FragColor = vec4(0.0, result, result, 1.0);\n}',
    height: 'precision mediump float;\nuniform vec2 mouse;\nuniform float size;\nuniform sampler2D velocity;\nuniform sampler2D height;\n\nvoid main(){\n  vec2 ref = gl_FragCoord.xy / size;\n  float ht = texture2D(height, ref).z - 0.5;\n  float vel = texture2D(velocity, ref).z - 0.5;\n  float result = distance(mouse, gl_FragCoord.xy) < 1.0\n    ? 1.0\n    : 0.5 + ht + vel;\n  gl_FragColor = vec4(0.0, result, result, 1.0);\n}'
  };

  gl = new MicroGL({
    antialias: false
  });

  mouse = {
    x: 0,
    y: 0
  };

  program = {};

  constant = null;

  velocity = null;

  height = null;

  size = 256;

  main = function() {
    var d;
    gl.init(document.body, size, size);
    program.velocity = gl.makeProgram(vshader, fshader.velocity);
    program.height = gl.makeProgram(vshader, fshader.height);
    velocity = gl.frame();
    height = gl.frame();
    gl.program(vshader, 'precision mediump float;void main(){gl_FragColor=vec4(vec3(.5),1.);}').bindVars({
      position: [-1, -1, -1, 1, 1, -1, 1, 1]
    }).drawFrame(velocity).drawFrame(height);
    d = 1 - 2 / size;
    constant = gl.program(program.height).variable({
      position: [-d, -d, -d, d, d, -d, d, d],
      size: size
    });
    gl.gl.canvas.addEventListener('mousemove', function(e) {
      mouse.x = e.offsetX;
      return mouse.y = size - e.offsetY;
    }, false);
    return update();
  };

  update = function() {
    gl.program(program.velocity).bind(constant).bindVars({
      velocity: velocity.color,
      height: height.color
    }).drawFrame(velocity).program(program.height).bind(constant).bindVars({
      mouse: [mouse.x, mouse.y],
      velocity: velocity.color,
      height: height.color
    }).drawFrame(height).draw();
    return requestAnimationFrame(update);
  };

  main();

}).call(this);

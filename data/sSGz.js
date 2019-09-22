(function() {
  var fshader, gl, main, size, startT, update, vshader;

  vshader = 'attribute vec2 a_position;\nuniform mat4 u_perspective;\nuniform vec2 u_origin;\nvarying vec3 v_position;\n\nfloat random(vec2 p){\n  return fract(sin(p.x + p.y * 1.3 + 0.1) * 12345.6789);\n}\nfloat noise(vec2 p, float scale){\n  const vec2 D = vec2(0.0, 1.0);\n  vec2 q = p / scale, i = floor(q), f = fract(q);\n  return mix(\n    mix(random(i), random(i + D.yx), smoothstep(0.0, 1.0, f.x)),\n    mix(random(i + D), random(i + D.yy), smoothstep(0.0, 1.0, f.x)),\n    smoothstep(0.0, 1.0, f.y)\n  );\n}\n\nvoid main(){\n  float height = 0.0, scale = 1.0;\n  vec2 p = 256.0 * a_position + u_origin;\n  for(int i = 0; i <= 5; i++){\n    height += scale * noise(p, scale) / 64.0;\n    scale += scale;\n  }\n  gl_Position = u_perspective * vec4(\n    24.0 * a_position.x - 12.0,\n    4.0 * height - 12.0,\n    24.0 * a_position.y + 5.0,\n    1.0\n  );\n  v_position = vec3(a_position, height);\n}';

  fshader = 'precision mediump float;\nvarying vec3 v_position;\nconst vec3 light = vec3(1.0);\nconst vec3 color = vec3(0.3, 0.9, 0.1);\n\nvoid main(){\n  gl_FragColor = vec4((1.0 - v_position.y) * v_position.z * color, 1.0);\n}';

  gl = new MicroGL({
    antialias: false
  });

  startT = 0;

  size = 128;

  main = function() {
    var terrain, x, y, _i, _j;
    terrain = [];
    for (y = _i = 0; _i < size; y = _i += 1) {
      terrain.push(0, y / size);
      for (x = _j = 0; _j <= size; x = _j += 1) {
        terrain.push(x / size, y / size, x / size, (y + 1) / size);
      }
      terrain.push(1, (y + 1) / size);
    }
    gl.init(document.body).program(vshader, fshader).bindVars({
      a_position: terrain,
      u_perspective: [2, 0.000, 0.000, 0.000, 0, 1.732, -0.505, -0.500, 0, 1.000, 0.875, 0.866, 0, 0.000, -1.010, 0.000]
    });
    startT = Date.now();
    return update();
  };

  update = function() {
    var t;
    t = (Date.now() - startT) * 0.1;
    gl.bindVars({
      u_origin: [0, t]
    }).clear().draw();
    return requestAnimationFrame(update);
  };

  main();

}).call(this);

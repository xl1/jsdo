(function() {
  var frame, fshader, gl, initAttribute, initMap, main, mouse, program, reference, size, update, vshader;

  vshader = {
    map: 'attribute vec2 position;\nvoid main(){\n  gl_Position = vec4(position, 0.0, 1.0);\n}',
    main: 'attribute vec2 reference;\nuniform sampler2D map;\nvoid main(){\n  vec2 pos = (texture2D(map, reference).xy * 255.0 + vec2(0.5)) / 256.0;\n  gl_Position = vec4(2.0 * pos.x - 1.0, pos.y, 0.0, 1.0);\n  gl_PointSize = 1.0;\n}'
  };

  fshader = {
    map: 'precision mediump float;\nuniform sampler2D previous;\nuniform vec2 mouse;\nuniform float size;\n\nvec2 random(){\n  return sin(gl_FragCoord.yx * vec2(1234.5, 678.9));\n}\n\nvoid main(){\n  vec2 result;\n  vec2 ref = gl_FragCoord.xy / vec2(size, size * 2.0);\n  vec2 velref = mod(ref, vec2(1.0, 0.5));\n  vec2 posref = velref + vec2(0.0, 0.5);\n  vec2 vel = texture2D(previous, velref).xy - vec2(0.5);\n  vec2 pos = texture2D(previous, posref).xy;\n  vec2 dif = mouse - pos;\n  float len2 = dif.x * dif.x + dif.y * dif.y;\n  if(ref.y < 0.5){\n    // lower half: velocity\n    result = (0.97 * vel) + (0.009 * dif / len2) + (0.002 * random()) + vec2(0.5);\n  } else {\n    // upper half: position\n    result = fract(0.07 * vel + pos);\n  }\n  gl_FragColor = vec4(result, 0.0, 1.0);\n}',
    main: 'precision mediump float;\nvoid main(){\n  gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);\n}'
  };

  size = 256;

  gl = new MicroGL({
    antialias: false
  });

  program = {};

  frame = null;

  reference = null;

  mouse = {
    x: 0.5,
    y: 0.5
  };

  initMap = function() {
    var ctx, idata, idx, _i, _ref;
    ctx = document.createElement('canvas').getContext('2d');
    ctx.canvas.width = size;
    ctx.canvas.height = size * 2;
    idata = ctx.createImageData(size, size * 2);
    for (idx = _i = 0, _ref = size * size * 8; _i < _ref; idx = _i += 4) {
      idata.data.set([Math.random() * 256, Math.random() * 256, 0, 255], idx);
    }
    ctx.putImageData(idata, 0, 0);
    return gl.program(program.map).bindVars({
      position: [-1, -1, -1, 1, 1, -1, 1, 1],
      size: size,
      mouse: [0.5, 0.5],
      previous: ctx.canvas
    }).drawFrame(frame);
  };

  initAttribute = function() {
    var ary, x, y, _i, _j;
    ary = [];
    for (x = _i = 0; _i < 256; x = ++_i) {
      for (y = _j = 0; _j < 256; y = ++_j) {
        ary.push((x + 0.5) / size, (y + 0.5) / size / 2 + 0.5);
      }
    }
    return reference = gl.program(program.main).variable({
      reference: ary
    });
  };

  main = function() {
    gl.init(document.body, size, size * 2);
    program.main = gl.makeProgram(vshader.main, fshader.main);
    program.map = gl.makeProgram(vshader.map, fshader.map);
    frame = gl.frame();
    gl.gl.canvas.addEventListener('mousemove', function(e) {
      mouse.x = e.offsetX / size;
      return mouse.y = Math.max(0, 1 - e.offsetY / size);
    }, false);
    initMap();
    initAttribute();
    return update();
  };

  update = function() {
    gl.program(program.map).bindVars({
      position: [-1, -1, -1, 1, 1, -1, 1, 1],
      size: size,
      previous: frame.color,
      mouse: [mouse.x, mouse.y]
    }).drawFrame(frame).program(program.main).bind(reference).bindVars({
      map: frame.color
    }).clear().draw('POINTS');
    return requestAnimationFrame(update);
  };

  main();

}).call(this);

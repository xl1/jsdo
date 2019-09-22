(function() {
  var frame, fshader, gl, glMain, initMap, main, mouse, size, update, vshader;

  vshader = 'attribute vec4 position;\nuniform mediump float size;\nvoid main(){\n  gl_Position = vec4(position.xy * 2.0 / size - vec2(1.0), 0.0, 1.0);\n  gl_PointSize = 1.0;\n}';

  fshader = {
    map: 'precision mediump float;\nuniform sampler2D previous;\nuniform vec2 mouse;\nuniform float size;\n\nvec2 random(){\n  return sin(gl_FragCoord.yx * vec2(1234.5, 678.9));\n}\n\nvoid main(){\n  vec2 result;\n  vec2 ref = gl_FragCoord.xy / vec2(size, size * 2.0);\n  vec2 velref = mod(ref, vec2(1.0, 0.5));\n  vec2 posref = velref + vec2(0.0, 0.5);\n  vec2 vel = texture2D(previous, velref).xy - vec2(0.5);\n  vec2 pos = texture2D(previous, posref).xy;\n  vec2 dif = mouse - pos;\n  float len2 = dif.x * dif.x + dif.y * dif.y;\n  if(ref.y < 0.5){\n    // lower half: velocity\n    result = 0.97 * vel + 0.009 * dif / len2 + 0.002 * random() + vec2(0.5);\n  } else {\n    // upper half: position\n    result = fract(0.07 * vel + pos);\n  }\n  gl_FragColor = vec4(result, 0.0, 1.0);\n}',
    main: 'precision mediump float;\nvoid main(){\n  gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);\n}'
  };

  size = 256;

  gl = new MicroGL({
    antialias: false
  });

  glMain = new MicroGL({
    antialias: false
  });

  frame = null;

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
    return gl.bindVars({
      previous: ctx.canvas,
      mouse: [mouse.x, mouse.y]
    }).drawFrame(frame);
  };

  main = function() {
    glMain.init(document.body, 256, 256).program(vshader, fshader.main).bindVars({
      size: 256
    });
    glMain.gl.canvas.addEventListener('mousemove', function(e) {
      mouse.x = e.offsetX / this.offsetWidth;
      return mouse.y = 1 - e.offsetY / this.offsetHeight;
    }, false);
    gl.init(document.body, size, size * 2).program(vshader, fshader.map).bindVars({
      position: [0, 0, 0, 0, 0, size, 0, 0, size, 0, 0, 0, size, size, 0, 0],
      size: size
    });
    frame = gl.frame();
    initMap();
    return update();
  };

  update = function() {
    gl.bindVars({
      previous: frame.color,
      mouse: [mouse.x, mouse.y]
    }).clear().draw().drawFrame(frame);
    glMain.bindVars({
      position: gl.read().subarray(size * size * 4)
    }).clear().draw('POINTS');
    return requestAnimationFrame(update);
  };

  main();

}).call(this);

(function() {
  var Color, canvas, colors, combinations, defaultCanvas, fshader, fshaderBase, main, makeCanvas, vshader;

  vshader = 'attribute vec2 a_position;\nvarying vec2 v_texCoord;\n\nvoid main(){\n  v_texCoord = a_position / 2.0 + vec2(0.5);\n  gl_Position = vec4(a_position, 0.0, 1.0);\n}';

  fshaderBase = 'precision mediump float;\nuniform sampler2D u_source;\nuniform sampler2D u_colors;\nvarying vec2 v_texCoord;\n\nconst float GAMMA = 2.2;\n\nvec4 gamma(vec4 color){\n  return pow(color, vec4(GAMMA));\n}\nvec4 ungamma(vec4 color){\n  return pow(color, vec4(1.0 / GAMMA));\n}\nint ditherIdx(){\n  float p = floor(mod(gl_FragCoord.x, 4.0));\n  float q = floor(mod(p - gl_FragCoord.y, 4.0));\n  return int(\n    8.0 * mod(q, 2.0) +\n    4.0 * mod(p, 2.0) +\n    2.0 * floor(q / 2.0) +\n    floor(p / 2.0)\n  );\n}';

  fshader = {
    tone: fshaderBase + 'const int COMBINATIONS = 64;\n\nvoid getColors(in int idx, out vec4 c1, out vec4 c2){\n  float x = (0.5 + float(idx)) / float(COMBINATIONS);\n  c1 = gamma(texture2D(u_colors, vec2(x, 0.0)));\n  c2 = gamma(texture2D(u_colors, vec2(x, 2.0)));\n}\nfloat ditherIndex(){\n  return (0.5 + float(ditherIdx())) / 16.0;\n}\nfloat calculateBestRatio(vec4 srcColor, vec4 c1, vec4 c2){\n  vec4 dif = c2 - c1;\n  return floor(\n    0.5 + dot(dif, srcColor - c1) / dot(dif, dif) * 16.0\n  ) / 16.0;\n}\nvec4 dither(vec4 srcColor){\n  vec4 c1, c2, canditate;\n  float ratio;\n  float d, minDist = 9.9;\n  float index = ditherIndex();\n  \n  for(int i = 0; i < COMBINATIONS; i++){\n    getColors(i, c1, c2);\n    ratio = calculateBestRatio(srcColor, c1, c2);\n    d = distance(srcColor, mix(c1, c2, clamp(ratio, 0.0, 1.0)));\n    if(minDist > d){\n      minDist = d;\n      if(index > ratio){\n        canditate = c1;\n      } else {\n        canditate = c2;\n      }\n    }\n  }\n  return canditate;\n}\nvoid main(){\n  vec4 srcColor = gamma(texture2D(u_source, v_texCoord));\n  gl_FragColor = ungamma(dither(srcColor));\n}',
    nterm: fshaderBase + 'const int LOOPMAX = 16;\nconst int COLORLEN = 16;\n\nvec4 getColor(int idx){\n  float x = (0.5 + float(idx)) / float(COLORLEN);\n  return gamma(texture2D(u_colors, vec2(x, 0.5)));\n}\nvec4 dither(vec4 srcColor){\n  vec4 sum = vec4(0.0);\n  int total = 0, di = ditherIdx();\n  \n  float d, mind;\n  vec4 color, next;\n  int nextp;\n\n  for(int i = 0; i < LOOPMAX; i++){\n    mind = 9.9;\n    for(int j = 0; j < COLORLEN; j++){\n      color = getColor(j);\n      for(int p = 1; p < LOOPMAX; p++){\n        d = distance(srcColor,\n          mix(sum, color, float(p) / float(total + p))\n        );\n        if(mind > d){\n          mind = d;\n          next = color;\n          nextp = p;\n        }\n      }\n    }\n    sum = mix(sum, next, float(nextp) / float(total + nextp));\n    total += nextp;\n    if(total > di) return next;\n  }\n  return vec4(0.0);\n}\nvoid main(){\n  vec4 srcColor = gamma(texture2D(u_source, v_texCoord));\n  gl_FragColor = ungamma(dither(srcColor));\n}',
    tknoll: fshaderBase + 'const int COLORLEN = 16;\nconst float COEF = 0.2;\n\nvec4 getColor(int idx){\n  float x = (0.5 + float(idx)) / float(COLORLEN);\n  return gamma(texture2D(u_colors, vec2(x, 0.5)));\n}\nvec4 nearest(vec4 srcColor){\n  vec4 col, minCol;\n  float d, mind = 9.9;\n  \n  for(int i = 0; i < COLORLEN; i++){\n    col = getColor(i);\n    d = distance(srcColor, col);\n    if(mind > d){\n      minCol = col;\n      mind = d;\n    }\n  }\n  return minCol;\n}\nvec4 dither(vec4 srcColor){\n  int index = ditherIdx();\n  vec4 nearCol, color = srcColor, err = vec4(0.0);\n  for(int i = 0; i < 16; i++){\n    nearCol = nearest(srcColor + COEF * err);\n    if(i == index) return nearCol;\n    err += srcColor - nearCol;\n  }\n  return vec4(0.0);\n}\nvoid main(){\n  vec4 srcColor = gamma(texture2D(u_source, v_texCoord));\n  gl_FragColor = ungamma(dither(srcColor));\n}',
    nodither: fshaderBase + 'const int COLORLEN = 16;\n\nvec4 getColor(int idx){\n  float x = (0.5 + float(idx)) / float(COLORLEN);\n  return gamma(texture2D(u_colors, vec2(x, 0.5)));\n}\nvec4 nearest(vec4 srcColor){\n  vec4 col, minCol;\n  float d, mind = 9.9;\n  \n  for(int i = 0; i < COLORLEN; i++){\n    col = getColor(i);\n    d = distance(srcColor, col);\n    if(mind > d){\n      minCol = col;\n      mind = d;\n    }\n  }\n  return minCol;\n}\nvoid main(){\n  vec4 srcColor = gamma(texture2D(u_source, v_texCoord));\n  gl_FragColor = ungamma(nearest(srcColor));\n}'
  };

  combinations = function(ary, len) {
    var a, i, last, res, _i, _j, _len, _len1, _ref;
    if (!len) {
      return [[]];
    }
    res = [];
    for (i = _i = 0, _len = ary.length; _i < _len; i = ++_i) {
      a = ary[i];
      _ref = combinations(ary.slice(i + 1), len - 1);
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        last = _ref[_j];
        res.push([a].concat(last));
      }
    }
    return res;
  };

  Color = (function() {

    function Color(r, g, b) {
      this.r = r != null ? r : 0;
      this.g = g != null ? g : 0;
      this.b = b != null ? b : 0;
    }

    Color.prototype.dist = function(color) {
      var db, dg, dr, _ref;
      _ref = [color.r - this.r, color.g - this.g, color.b - this.b], dr = _ref[0], dg = _ref[1], db = _ref[2];
      return Math.sqrt(dr * dr + dg * dg + db * db);
    };

    Color.prototype.luma = function() {
      return this.r * 0.3 + this.g * 0.59 + this.b * 0.11;
    };

    Color.prototype.toArray = function() {
      return [this.r, this.g, this.b];
    };

    Color.prototype.toString = function() {
      return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
    };

    return Color;

  })();

  makeCanvas = function(width, height, ary) {
    var color, ctx, idata, inner, x, y, _i, _j, _len, _len1;
    ctx = document.createElement('canvas').getContext('2d');
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    idata = ctx.createImageData(width, height);
    for (x = _i = 0, _len = ary.length; _i < _len; x = ++_i) {
      inner = ary[x];
      if (!('length' in inner)) {
        inner = [inner];
      }
      for (y = _j = 0, _len1 = inner.length; _j < _len1; y = ++_j) {
        color = inner[y];
        idata.data.set([color.r, color.g, color.b, 255], (x + y * width) << 2);
      }
    }
    ctx.putImageData(idata, 0, 0);
    return ctx.canvas;
  };

  colors = [new Color(30, 30, 30), new Color(250, 250, 250), new Color(200, 0, 0), new Color(250, 200, 0), new Color(0, 100, 50), new Color(0, 50, 200), new Color(30, 200, 30), new Color(250, 150, 250)];

  defaultCanvas = makeCanvas(16, 1, colors);

  canvas = {
    tone: makeCanvas(64, 2, combinations(colors.sort(function(a, b) {
      return a.luma() - b.luma();
    }), 2).sort(function(_arg, _arg1) {
      var a1, a2, b1, b2;
      a1 = _arg[0], a2 = _arg[1];
      b1 = _arg1[0], b2 = _arg1[1];
      return a1.dist(a2) - b1.dist(b2);
    }).slice(0, 64))
  };

  main = function() {
    var canv, gl, name, tex, _i, _len, _ref, _results;
    gl = new MicroGL({
      antialias: false
    });
    tex = gl.texture(document.getElementById('source'));
    gl.init(null, 256, 256).texParameter(tex, {
      filter: 'NEAREST'
    });
    _ref = document.querySelectorAll('canvas');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      canv = _ref[_i];
      name = canv.id;
      gl.program(vshader, fshader[name]).bindVars({
        a_position: [-1, -1, -1, 1, 1, -1, 1, 1],
        u_source: tex,
        u_colors: canvas[name] || defaultCanvas
      }).draw();
      _results.push(canv.getContext('2d').drawImage(gl.gl.canvas, 0, 0));
    }
    return _results;
  };

  window.addEventListener('load', main, false);

}).call(this);

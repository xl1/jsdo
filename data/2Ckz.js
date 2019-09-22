(function() {
  var CustomFilterGL, Mesh, ShaderPair,
    __hasProp = {}.hasOwnProperty;

  ShaderPair = (function() {
    var COMPOSITE_FRACTIONS, find, removeComment;

    find = function(str, search, start) {
      var idx;
      if (start == null) {
        start = 0;
      }
      idx = str.indexOf(search, start);
      if (idx === -1) {
        return Infinity;
      } else {
        return idx;
      }
    };

    removeComment = function(text) {
      var blockcomIdx, i, last, linecomIdx, re;
      i = last = 0;
      while (true) {
        linecomIdx = find(text, '//', i);
        blockcomIdx = find(text, '/*', i);
        if (!isFinite(linecomIdx) && !isFinite(blockcomIdx)) {
          return text;
        }
        if (linecomIdx < blockcomIdx) {
          i = linecomIdx;
          re = new RegExp(/$/gm);
          re.lastIndex = i;
          re.exec(text);
          last = re.lastIndex;
        } else {
          i = blockcomIdx;
          last = find(text, '*/', i) + 2;
        }
        text = text.slice(0, i) + text.slice(last);
      }
      return text;
    };

    COMPOSITE_FRACTIONS = {
      clear: ['0.0', '0.0'],
      copy: ['1.0', '0.0'],
      destination: ['0.0', '1.0'],
      source_over: ['1.0', '1.0 - src.a'],
      destination_over: ['1.0 - dst.a', '1.0'],
      source_in: ['dst.a', '0.0'],
      destination_in: ['0.0', 'src.a'],
      source_out: ['1.0 - dst.a', '0.0'],
      destination_out: ['0.0', '1.0 - src.a'],
      source_atop: ['dst.a', '1.0 - src.a'],
      destination_atop: ['1.0 - dst.a', 'src.a'],
      xor: ['1.0 - dst.a', '1.0 - src.a'],
      lighter: ['1.0', '1.0']
    };

    function ShaderPair(vertex, fragment, _mix, _blend, _composite) {
      this._mix = _mix != null ? _mix : false;
      this._blend = _blend != null ? _blend : 'normal';
      this._composite = _composite != null ? _composite : 'source-atop';
      vertex || (vertex = 'attribute vec4 a_position;\nuniform mat4 u_projectionMatrix;\nvoid main(){\n  gl_Position = u_projectionMatrix * a_position;\n}');
      fragment || (fragment = 'precision mediump float;\nvoid main(){}');
      this.original = {
        vertex: vertex,
        fragment: fragment
      };
      this.source = {
        vertex: vertex,
        fragment: fragment
      };
    }

    ShaderPair.prototype.convert = function() {
      this._removeComment();
      this._convertShader();
      return this.source;
    };

    ShaderPair.prototype._removeComment = function() {
      return this.source = {
        vertex: removeComment(this.source.vertex),
        fragment: removeComment(this.source.fragment)
      };
    };

    ShaderPair.prototype._getDeclarations = function() {
      var blend, composite, fd, fs, _ref;
      blend = this._blend.replace(/-/g, '_');
      composite = this._composite.replace(/-/g, '_');
      _ref = COMPOSITE_FRACTIONS[composite], fs = _ref[0], fd = _ref[1];
      return "varying vec2 INSERTED_v_texCoord;\nuniform sampler2D INSERTED_u_source;\nvec4 css_MixColor;\nmat4 css_ColorMatrix = mat4(1.0);\n\nvec3 INSERTED_mix_normal(vec3 cs, vec3 cd){\n  return cs;\n}\nvec3 INSERTED_mix_multiply(vec3 cs, vec3 cd){\n  return cs * cd;\n}\nvec3 INSERTED_mix_screen(vec3 cs, vec3 cd){\n  return cd + cs - cd * cs;\n}\nvec3 INSERTED_mix_darken(vec3 cs, vec3 cd){\n  return min(cs, cd);\n}\nvec3 INSERTED_mix_lighten(vec3 cs, vec3 cd){\n  return max(cs, cd);\n}\nvec3 INSERTED_mix_color_dodge(vec3 cs, vec3 cd){\n  return min(vec3(1.0), cd / (vec3(1.0) - cs));\n}\nvec3 INSERTED_mix_color_burn(vec3 cs, vec3 cd){\n  return max(vec3(0.0), vec3(1.0) - (vec3(1.0) - cd) / cs);\n}\nvec3 INSERTED_mix_hard_light(vec3 cs, vec3 cd){\n  vec3 color;\n  for(int i = 0; i < 3; i++){\n    if(cs[i] <= 0.5)\n      color[i] = INSERTED_mix_multiply(2.0 * cs, cd)[i];\n    else\n      color[i] = INSERTED_mix_screen(2.0 * cs - 1.0, cd)[i];\n  }\n  return color;\n}\nvec3 INSERTED_mix_soft_light(vec3 cs, vec3 cd){\n  vec3 color;\n  for(int i = 0; i < 3; i++){\n    float d;\n    if(cd[i] <= 0.25)\n      d = ((16.0 * cd[i] - 12.0) * cd[i] + 4.0) * cd[i];\n    else\n      d = sqrt(cd[i]);\n    if(cs[i] <= 0.5)\n      color[i] = cd[i] - (1.0 - 2.0 * cs[i]) * cd[i] * (1.0 - cd[i]);\n    else\n      color[i] = cd[i] + (2.0 * cs[i] - 1.0) * (d - cd[i]);\n  }\n  return color;\n}\nvec3 INSERTED_mix_overlay(vec3 cs, vec3 cd){\n  return INSERTED_mix_hard_light(cd, cs);\n}\nvec3 INSERTED_mix_defference(vec3 cs, vec3 cd){\n  return abs(cs - cd);\n}\nvec3 INSERTED_mix_exclusion(vec3 cs, vec3 cd){\n  return cs + cd - 2.0 * cs * cd;\n}\n\nfloat INSERTED_luma(vec3 col){\n  return dot(vec3(0.3, 0.59, 0.11), col);\n}\nvec3 INSERTED_rgb2lch(vec3 rgb){\n  float\n    mx = max(max(rgb.r, rgb.g), rgb.b),\n    mn = min(min(rgb.r, rgb.g), rgb.b),\n    luma = INSERTED_luma(rgb),\n    chroma = mx - mn,\n    hue;\n\n  if(mx == rgb.r)\n    hue = mod((rgb.g - rgb.b) / chroma, 6.0);\n  if(mx == rgb.g)\n    hue = (rgb.b - rgb.r) / chroma + 2.0;\n  if(mx == rgb.b)\n    hue = (rgb.r - rgb.g) / chroma + 4.0;\n\n  return vec3(luma, chroma, hue);\n}\nvec3 INSERTED_lch2rgb(vec3 lch){\n  float \n    luma = lch.x,\n    chroma = lch.y,\n    hue = lch.z,\n    second = chroma * (1.0 - abs(mod(hue, 2.0) - 1.0));\n  vec3 rgb;\n\n  if(hue < 1.0)\n    rgb = vec3(chroma, second, 0.0); \n  else if(hue < 2.0)\n    rgb = vec3(second, chroma, 0.0); \n  else if(hue < 3.0)\n    rgb = vec3(0.0, chroma, second); \n  else if(hue < 4.0)\n    rgb = vec3(0.0, second, chroma); \n  else if(hue < 5.0)\n    rgb = vec3(second, 0.0, chroma); \n  else\n    rgb = vec3(chroma, 0.0, second); \n  \n  rgb += vec3(luma - INSERTED_luma(rgb));\n  return rgb;\n}\n\nvec3 INSERTED_mix_hue(vec3 cs, vec3 cd){\n  vec3 ls = INSERTED_rgb2lch(cs), ld = INSERTED_rgb2lch(cd);\n  return INSERTED_lch2rgb(vec3(ld.x, ld.y, ls.z));\n}\nvec3 INSERTED_mix_saturation(vec3 cs, vec3 cd){\n  vec3 ls = INSERTED_rgb2lch(cs), ld = INSERTED_rgb2lch(cd);\n  return INSERTED_lch2rgb(vec3(ld.x, ls.y, ld.z));\n}\nvec3 INSERTED_mix_color(vec3 cs, vec3 cd){\n  vec3 ls = INSERTED_rgb2lch(cs), ld = INSERTED_rgb2lch(cd);\n  return INSERTED_lch2rgb(vec3(ld.x, ls.y, ls.z));\n}\nvec3 INSERTED_mix_luminosity(vec3 cs, vec3 cd){\n  vec3 ls = INSERTED_rgb2lch(cs), ld = INSERTED_rgb2lch(cd);\n  return INSERTED_lch2rgb(vec3(ls.x, ld.y, ld.z));\n}\n\nvoid INSERTED_setFragColor(){\n  vec4 sourceColor = texture2D(INSERTED_u_source, INSERTED_v_texCoord);\n  vec4 dst = css_ColorMatrix * sourceColor;\n  vec4 src = css_MixColor;\n\n  vec3 rgb = clamp(INSERTED_mix_" + blend + "(src.rgb, dst.rgb), 0.0, 1.0);\n  float rs = src.a * " + fs + ";\n  float rd = dst.a * " + fd + ";\n  float outa = rs + rd;\n  if(outa == 0.0) gl_FragColor = vec4(0.0);\n  gl_FragColor = vec4(\n    (rs * rgb + rd * dst.rgb) / outa,\n    outa\n  );\n}";
    };

    ShaderPair.prototype._convertShader = function() {
      var vertex;
      if (!this._mix) {
        return;
      }
      vertex = removeComment(this.source.vertex);
      if (!/attribute\s+vec2\s+a_texCoord\W/.test(vertex)) {
        vertex = vertex.replace(/(\W)(void\s+main\W)/, '$1attribute vec2 a_texCoord;\n$2');
      }
      return this.source = {
        vertex: vertex.replace(/(\W)(void\s+main\W+?\{)/, '$1varying vec2 INSERTED_v_texCoord;\n$2\nINSERTED_v_texCoord = a_texCoord;'),
        fragment: removeComment(this.source.fragment).replace(/\Wcss_(MixColor|ColorMatrix)\W[\w\W]*?;/g, '$&\nINSERTED_setFragColor();').replace(/(\W)(void\smain\W+?\{)/, '$1' + this._getDeclarations() + '$2\nINSERTED_setFragColor();')
      };
    };

    return ShaderPair;

  })();

  Mesh = (function() {

    function Mesh(cols, rows, _box, _detached) {
      this.cols = cols != null ? cols : 1;
      this.rows = rows != null ? rows : 1;
      this._box = _box != null ? _box : 'filter-box';
      this._detached = _detached != null ? _detached : false;
      this.attributes = {};
    }

    Mesh.prototype._makeAttachedAttributes = function() {
      var a_meshCoord, a_position, a_texCoord, cols, i, idx, indices, j, rows, x, y, _i, _j;
      cols = this.cols, rows = this.rows;
      a_position = [];
      a_texCoord = [];
      a_meshCoord = [];
      indices = [];
      for (i = _i = 0; 0 <= cols ? _i <= cols : _i >= cols; i = 0 <= cols ? ++_i : --_i) {
        for (j = _j = 0; 0 <= rows ? _j <= rows : _j >= rows; j = 0 <= rows ? ++_j : --_j) {
          x = i / cols;
          y = j / rows;
          a_position.push(x - 0.5, y - 0.5, 0, 1);
          a_texCoord.push(x, y);
          a_meshCoord.push(x, y);
          if (i && j) {
            idx = i + j * (cols + 1);
            indices.push(idx - 2 - cols, idx - 1 - cols, idx);
            indices.push(idx - 2 - cols, idx, idx - 1);
          }
        }
      }
      return this.attributes = {
        a_position: a_position,
        a_texCoord: a_texCoord,
        a_meshCoord: a_meshCoord,
        INDEX: indices
      };
    };

    Mesh.prototype._makeDetachedAttributes = function() {
      var a_meshCoord, a_position, a_texCoord, a_triangleCoord, cols, i, j, k, rows, x, y, _i, _j, _k;
      cols = this.cols, rows = this.rows;
      a_position = [];
      a_texCoord = [];
      a_meshCoord = [];
      a_triangleCoord = [];
      for (i = _i = 0; 0 <= cols ? _i < cols : _i > cols; i = 0 <= cols ? ++_i : --_i) {
        for (j = _j = 0; 0 <= rows ? _j < rows : _j > rows; j = 0 <= rows ? ++_j : --_j) {
          for (k = _k = 0; _k <= 5; k = ++_k) {
            a_triangleCoord.push(i, j, k + 1);
            x = k === 0 || k === 3 || k === 5 ? i / cols : (i + 1) / cols;
            y = k === 0 || k === 1 || k === 3 ? j / rows : (j + 1) / rows;
            a_position.push(x - 0.5, y - 0.5, 0, 1);
            a_texCoord.push(x, y);
            a_meshCoord.push(x, y);
          }
        }
      }
      return this.attributes = {
        a_position: a_position,
        a_texCoord: a_texCoord,
        a_meshCoord: a_meshCoord,
        a_triangleCoord: a_triangleCoord,
        INDEX: null
      };
    };

    Mesh.prototype.makeAttributes = function() {
      return this["_make" + (this._detached ? 'De' : 'At') + "tachedAttributes"]();
    };

    return Mesh;

  })();

  CustomFilterGL = (function() {

    function CustomFilterGL(parent, width, height) {
      var st;
      if (parent == null) {
        parent = document.body;
      }
      this.width = width != null ? width : 256;
      this.height = height != null ? height : 256;
      this.gl = new MicroGL;
      this.gl.init(parent, this.width, this.height);
      this.canvas = this.gl.gl.canvas;
      st = this.canvas.style;
      st.WebkitTransform = st.MozTransform = st.MsTransform = st.transform = 'rotateX(180deg)';
      this.variables = {};
    }

    CustomFilterGL.prototype.draw = function() {
      var key, value, vars, _ref;
      vars = {};
      _ref = this.variables;
      for (key in _ref) {
        if (!__hasProp.call(_ref, key)) continue;
        value = _ref[key];
        if (this.gl.uniforms[key] || this.gl.attributes[key] || (key === 'INDEX')) {
          vars[key] = value;
        }
      }
      this.gl.bindVars(vars);
      this.gl.draw('TRIANGLES');
      this._drawn = true;
      return this;
    };

    CustomFilterGL.prototype._createTexture = function(src) {
      var canv, ctx;
      canv = document.createElement('canvas');
      canv.width = src.width || src.offsetWidth;
      canv.height = src.height || src.offsetHeight;
      ctx = canv.getContext('2d');
      ctx.scale(1, -1);
      ctx.drawImage(src, 0, -canv.height);
      return canv;
    };

    CustomFilterGL.prototype.source = function(img) {
      this._drawn = false;
      this.uniforms({
        INSERTED_u_source: img
      });
      return this;
    };

    CustomFilterGL.prototype.shader = function(vertex, fragment, mix, blend, composite) {
      var shd, _ref;
      this._drawn = false;
      shd = (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(ShaderPair, arguments, function(){});
      _ref = shd.convert(), vertex = _ref.vertex, fragment = _ref.fragment;
      this.gl.program(vertex, fragment);
      return this;
    };

    CustomFilterGL.prototype.mesh = function(cols, rows, box, detached) {
      var key, msh, value, _ref;
      this._drawn = false;
      msh = (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(Mesh, arguments, function(){});
      this.uniforms({
        u_projectionMatrix: [2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1],
        u_textureSize: [this.width, this.height],
        u_meshBox: [-0.5, -0.5, 1, 1],
        u_tileSize: [this.width / msh.cols, this.height / msh.rows],
        u_meshSize: [msh.cols, msh.rows]
      });
      _ref = msh.makeAttributes();
      for (key in _ref) {
        if (!__hasProp.call(_ref, key)) continue;
        value = _ref[key];
        this.variables[key] = value;
      }
      return this;
    };

    CustomFilterGL.prototype.uniforms = function(param) {
      var img, key, value,
        _this = this;
      this._drawn = false;
      for (key in param) {
        if (!__hasProp.call(param, key)) continue;
        value = param[key];
        if (typeof value === 'string') {
          img = document.createElement('img');
          img.onload = function() {
            _this.variables[key] = _this._createTexture(img);
            if (_this._drawn) {
              return _this.draw();
            }
          };
          img.src = value;
        } else if ((value.length != null) || typeof value !== 'object') {
          this.variables[key] = value;
        } else {
          this.variables[key] = this._createTexture(value);
        }
      }
      return this;
    };

    return CustomFilterGL;

  })();

  if (typeof window !== "undefined" && window !== null) {
    window.CustomFilterGL = CustomFilterGL;
  }

}).call(this);

(function() {
  var MicroGL, RC, TYPESIZE, TYPESUFFIX,
    __slice = [].slice;

  RC = WebGLRenderingContext;

  TYPESUFFIX = {};

  TYPESUFFIX[RC.FLOAT] = '1f';

  TYPESUFFIX[RC.FLOAT_VEC2] = '2fv';

  TYPESUFFIX[RC.FLOAT_VEC3] = '3fv';

  TYPESUFFIX[RC.FLOAT_VEC4] = '4fv';

  TYPESUFFIX[RC.INT] = '1i';

  TYPESUFFIX[RC.INT_VEC2] = '2iv';

  TYPESUFFIX[RC.INT_VEC3] = '3iv';

  TYPESUFFIX[RC.INT_VEC4] = '4iv';

  TYPESUFFIX[RC.BOOL] = '1i';

  TYPESUFFIX[RC.BOOL_VEC2] = '2iv';

  TYPESUFFIX[RC.BOOL_VEC3] = '3iv';

  TYPESUFFIX[RC.BOOL_VEC4] = '4iv';

  TYPESUFFIX[RC.FLOAT_MAT2] = 'Matrix2fv';

  TYPESUFFIX[RC.FLOAT_MAT3] = 'Matrix3fv';

  TYPESUFFIX[RC.FLOAT_MAT4] = 'Matrix4fv';

  TYPESUFFIX[RC.SAMPLER_2D] = 'Sampler2D';

  TYPESUFFIX[RC.SAMPLER_CUBE] = 'SamplerCube';

  TYPESIZE = {};

  TYPESIZE[RC.FLOAT] = 1;

  TYPESIZE[RC.FLOAT_VEC2] = 2;

  TYPESIZE[RC.FLOAT_VEC3] = 3;

  TYPESIZE[RC.FLOAT_VEC4] = 4;

  TYPESIZE[RC.FLOAT_MAT2] = 4;

  TYPESIZE[RC.FLOAT_MAT3] = 9;

  TYPESIZE[RC.FLOAT_MAT4] = 16;

  MicroGL = (function() {

    function MicroGL(opt) {
      var c;
      c = document.createElement('canvas');
      this.gl = c.getContext('webgl', opt) || c.getContext('experimental-webgl', opt);
      this.enabled = !!this.gl;
      this.uniforms = {};
      this.attributes = {};
      this.textures = {};
      this.cache = {};
    }

    MicroGL.prototype.init = function(elem, width, height) {
      if (width == null) {
        width = 256;
      }
      if (height == null) {
        height = 256;
      }
      this.width = this.gl.canvas.width = width;
      this.height = this.gl.canvas.height = height;
      if (elem != null) {
        elem.appendChild(this.gl.canvas);
      }
      this.gl.viewport(0, 0, width, height);
      this.gl.clearColor(0, 0, 0, 1);
      this.gl.clearDepth(1);
      this.gl.enable(this.gl.DEPTH_TEST);
      this.gl.depthFunc(this.gl.LEQUAL);
      return this;
    };

    MicroGL.prototype._initShader = function(type, source) {
      var shader;
      shader = this.gl.createShader(type);
      this.gl.shaderSource(shader, source);
      this.gl.compileShader(shader);
      if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
        return console.log(this.gl.getShaderInfoLog(shader));
      } else {
        return shader;
      }
    };

    MicroGL.prototype.makeProgram = function(vsSource, fsSource, uniformTypes, attributeTypes) {
      var dslarg, program;
      program = this.gl.createProgram();
      if ((typeof ShaderDSL !== "undefined" && ShaderDSL !== null) && (typeof vsSource === 'function')) {
        dslarg = {
          vertexShader: vsSource,
          fragmentShader: fsSource,
          uniforms: uniformTypes,
          attributes: attributeTypes
        };
        vsSource = ShaderDSL.compileVertexShader(dslarg);
        fsSource = ShaderDSL.compileFragmentShader(dslarg);
      }
      this.gl.attachShader(program, this._initShader(this.gl.VERTEX_SHADER, vsSource));
      this.gl.attachShader(program, this._initShader(this.gl.FRAGMENT_SHADER, fsSource));
      this.gl.linkProgram(program);
      if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
        return console.log(this.gl.getProgramInfoLog(program));
      } else {
        return program;
      }
    };

    MicroGL.prototype.program = function() {
      var args, attribute, i, loc, name, program, uniform, _i, _j, _k, _len, _ref, _ref1, _ref2;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      program = args[1] ? this.makeProgram.apply(this, args) : args[0];
      this.uniforms = {};
      _ref = Object.keys(this.attributes);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        this.gl.disableVertexAttribArray(this.attributes[name].location);
      }
      this.attributes = {};
      this._useElementArray = false;
      this.gl.useProgram(program);
      for (i = _j = 0, _ref1 = this.gl.getProgramParameter(program, this.gl.ACTIVE_UNIFORMS); _j < _ref1; i = _j += 1) {
        uniform = this.gl.getActiveUniform(program, i);
        name = uniform.name;
        this.uniforms[name] = {
          location: this.gl.getUniformLocation(program, name),
          type: uniform.type,
          size: uniform.size,
          name: name
        };
      }
      for (i = _k = 0, _ref2 = this.gl.getProgramParameter(program, this.gl.ACTIVE_ATTRIBUTES); _k < _ref2; i = _k += 1) {
        attribute = this.gl.getActiveAttrib(program, i);
        name = attribute.name;
        loc = this.gl.getAttribLocation(program, name);
        this.gl.enableVertexAttribArray(loc);
        this.attributes[name] = {
          location: loc,
          type: attribute.type,
          size: attribute.size,
          name: name
        };
      }
      return this;
    };

    MicroGL.prototype.blend = function(sourceFactor, destFactor) {
      var dFactor, sFactor;
      sFactor = ('' + sourceFactor).toUpperCase();
      dFactor = ('' + destFactor).toUpperCase();
      if (destFactor) {
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl[sFactor], this.gl[dFactor]);
      } else {
        switch (sFactor) {
          case 'FALSE':
            this.gl.disable(this.gl.BLEND);
            break;
          case 'TRUE':
            this.gl.enable(this.gl.BLEND);
            break;
          case 'CLEAR':
            this.blend('ZERO', 'ZERO');
            break;
          case 'COPY':
            this.blend('ONE', 'ZERO');
            break;
          case 'DESTINATION':
            this.blend('ZERO', 'ONE');
            break;
          case 'SOURCE-OVER':
            this.blend('ONE', 'ONE_MINUS_SRC_ALPHA');
            break;
          case 'DESTINATION-OVER':
            this.blend('ONE_MINUS_DST_ALPHA', 'ONE');
            break;
          case 'SOURCE-IN':
            this.blend('DST_ALPHA', 'ZERO');
            break;
          case 'DESTINATION-IN':
            this.blend('ZERO', 'SRC_ALPHA');
            break;
          case 'SOURCE-OUT':
            this.blend('ONE_MINUS_DST_ALPHA', 'ZERO');
            break;
          case 'DESTINATION-OUT':
            this.blend('ZERO', 'ONE_MINUS_SRC_ALPHA');
            break;
          case 'SOURCE-ATOP':
            this.blend('DST_ALPHA', 'ONE_MINUS_SRC_ALPHA');
            break;
          case 'DESTINATION-ATOP':
            this.blend('ONE_MINUS_DST_ALPHA', 'SRC_ALPHA');
            break;
          case 'XOR':
            this.blend('ONE_MINUS_DST_ALPHA', 'ONE_MINUS_SRC_ALPHA');
            break;
          case 'LIGHTER':
            this.blend('ONE', 'ONE');
            break;
          case 'MULTIPLY':
            this.blend('ZERO', 'SRC_COLOR');
            break;
          case 'SCREEN':
            this.blend('ONE_MINUS_DST_COLOR', 'ONE');
            break;
          case 'EXCLUSION':
            this.blend('ONE_MINUS_DST_COLOR', 'ONE_MINUS_SRC_COLOR');
            break;
          case 'ADD':
            this.blend('SRC_ALPHA', 'ONE');
            break;
          case 'DEFAULT':
            this.blend('SRC_ALPHA', 'ONE_MINUS_SRC_ALPHA');
            break;
          default:
            console.warn('unsupported blend mode: ' + sourceFactor);
        }
      }
      return this;
    };

    MicroGL.prototype.loadImages = function(paths, callback, failCallback) {
      var error, img, imgs, left, onerror, onload, path;
      if (typeof paths === 'string') {
        paths = [paths];
      }
      left = paths.length;
      error = 0;
      onload = function() {
        return --left || callback.apply(null, imgs);
      };
      onerror = function() {
        return error++ || (typeof failCallback === "function" ? failCallback() : void 0);
      };
      return imgs = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = paths.length; _i < _len; _i++) {
          path = paths[_i];
          img = document.createElement('img');
          img.onload = onload;
          img.onerror = onerror;
          img.src = path;
          _results.push(img);
        }
        return _results;
      })();
    };

    MicroGL.prototype.texParameter = function(tex, param, cube) {
      var filter, type, wrap, _ref, _ref1;
      if (param == null) {
        param = {};
      }
      type = cube ? this.gl.TEXTURE_CUBE_MAP : this.gl.TEXTURE_2D;
      filter = this.gl[(_ref = param.filter) != null ? _ref : 'LINEAR'];
      wrap = this.gl[(_ref1 = param.wrap) != null ? _ref1 : 'CLAMP_TO_EDGE'];
      this.gl.bindTexture(type, tex);
      this.gl.texParameteri(type, this.gl.TEXTURE_MAG_FILTER, filter);
      this.gl.texParameteri(type, this.gl.TEXTURE_MIN_FILTER, filter);
      this.gl.texParameteri(type, this.gl.TEXTURE_WRAP_S, wrap);
      this.gl.texParameteri(type, this.gl.TEXTURE_WRAP_T, wrap);
      this.gl.bindTexture(type, null);
      return this;
    };

    MicroGL.prototype.texParameterCube = function(tex, param) {
      return this.texParameter(tex, param, true);
    };

    MicroGL.prototype._setTexture = function(img, tex, empty) {
      this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
      this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
      if (empty) {
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, img.width, img.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
      } else {
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, img);
      }
      this.gl.bindTexture(this.gl.TEXTURE_2D, null);
      return this.texParameter(tex);
    };

    MicroGL.prototype._setTextureCube = function(imgs, tex, empty) {
      var i, img, _i, _j, _len;
      this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, tex);
      if (empty) {
        for (i = _i = 0; _i < 6; i = ++_i) {
          this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, this.gl.RGBA, imgs.width, imgs.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
        }
      } else {
        for (i = _j = 0, _len = imgs.length; _j < _len; i = ++_j) {
          img = imgs[i];
          this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, img);
        }
      }
      this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, null);
      return this.texParameterCube(tex);
    };

    MicroGL.prototype.texture = function(source, tex, callback) {
      var _this = this;
      if (source instanceof WebGLTexture) {
        return source;
      }
      tex || (tex = this.gl.createTexture());
      if (typeof source === 'string') {
        this.loadImages(source, function(img) {
          _this._setTexture(img, tex);
          if (callback) {
            return callback(tex);
          } else if (_this._drawArg) {
            _this.gl.bindTexture(_this.gl.TEXTURE_2D, tex);
            return _this.draw.apply(_this, _this._drawArg);
          }
        });
      } else {
        this._setTexture(source, tex);
      }
      return tex;
    };

    MicroGL.prototype.textureCube = function(source, tex, callback) {
      var _this = this;
      if (source instanceof WebGLTexture) {
        return source;
      }
      tex || (tex = this.gl.createTexture());
      if (typeof source[0] === 'string') {
        this.loadImages(source, function() {
          var imgs;
          imgs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          _this._setTextureCube(imgs, tex);
          if (callback) {
            return callback(tex);
          } else if (_this._drawArg) {
            _this.gl.bindTexture(_this.gl.TEXTURE_CUBE_MAP, tex);
            return _this.draw.apply(_this, _this._drawArg);
          }
        });
      } else {
        this._setTextureCube(source, tex);
      }
      return tex;
    };

    MicroGL.prototype.variable = function(param, useCache) {
      var buffer, name, obj, uniform, value, _base, _i, _len, _ref;
      obj = {};
      _ref = Object.keys(param);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        value = param[name];
        if (uniform = this.uniforms[name]) {
          switch (TYPESUFFIX[uniform.type]) {
            case 'Sampler2D':
              if (useCache) {
                value = this.cache[name] = this.texture(value, this.cache[name]);
              } else {
                value = this.texture(value);
              }
              break;
            case 'SamplerCube':
              if (useCache) {
                value = this.cache[name] = this.textureCube(value, this.cache[name]);
              } else {
                value = this.textureCube(value);
              }
          }
          obj[name] = value;
        } else if (this.attributes[name] || (name === 'INDEX')) {
          if (!(value != null)) {
            obj[name] = null;
            continue;
          }
          if (useCache) {
            buffer = (_base = this.cache)[name] || (_base[name] = this.gl.createBuffer());
          } else {
            buffer = this.gl.createBuffer();
          }
          if (name === 'INDEX') {
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(value), this.gl.STATIC_DRAW);
          } else {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(value), this.gl.STATIC_DRAW);
          }
          buffer.length = value.length;
          obj[name] = buffer;
        }
      }
      return obj;
    };

    MicroGL.prototype._bindUniform = function(uniform, value) {
      var suffix;
      suffix = TYPESUFFIX[uniform.type];
      if (~suffix.indexOf('Sampler')) {
        return this.textures[uniform.name] = value;
      } else if (~suffix.indexOf('Matrix')) {
        return this.gl["uniform" + suffix](uniform.location, false, new Float32Array(value));
      } else {
        return this.gl["uniform" + suffix](uniform.location, value);
      }
    };

    MicroGL.prototype._rebindTexture = function() {
      var name, texIndex, type, uniform, _i, _len, _ref;
      texIndex = 0;
      _ref = Object.keys(this.uniforms);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        uniform = this.uniforms[name];
        if (uniform.type === this.gl.SAMPLER_2D) {
          type = this.gl.TEXTURE_2D;
        } else if (uniform.type === this.gl.SAMPLER_CUBE) {
          type = this.gl.TEXTURE_CUBE_MAP;
        } else {
          continue;
        }
        this.gl.activeTexture(this.gl['TEXTURE' + texIndex]);
        this.gl.bindTexture(type, this.textures[name]);
        this.gl.uniform1i(uniform.location, texIndex);
        texIndex++;
      }
      return this;
    };

    MicroGL.prototype._bindAttribute = function(attribute, value) {
      var size;
      size = TYPESIZE[attribute.type];
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, value);
      this.gl.vertexAttribPointer(attribute.location, size, this.gl.FLOAT, false, 0, 0);
      return this._numArrays = value.length / size;
    };

    MicroGL.prototype.bind = function(obj) {
      var attribute, name, uniform, value, _i, _len, _ref;
      this._drawArg = void 0;
      _ref = Object.keys(obj);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        value = obj[name];
        if (name === 'INDEX') {
          this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, value);
          this._useElementArray = value != null;
          this._numElements = value != null ? value.length : void 0;
        } else if (uniform = this.uniforms[name]) {
          this._bindUniform(uniform, value);
        } else if (attribute = this.attributes[name]) {
          this._bindAttribute(attribute, value);
        }
      }
      return this;
    };

    MicroGL.prototype.bindVars = function(param) {
      return this.bind(this.variable(param, true));
    };

    MicroGL.prototype.frame = function(width, height, flags) {
      var fb, rb, tex;
      if (width == null) {
        width = this.width;
      }
      if (height == null) {
        height = this.height;
      }
      if (flags == null) {
        flags = {};
      }
      fb = this.gl.createFramebuffer();
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fb);
      tex = this.gl.createTexture();
      if (flags.cube) {
        this._setTextureCube({
          width: width,
          height: height
        }, tex, true);
      } else {
        this._setTexture({
          width: width,
          height: height
        }, tex, true);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, tex, 0);
      }
      rb = this.gl.createRenderbuffer();
      this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, rb);
      this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, width, height);
      this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, rb);
      this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
      fb.color = tex;
      return fb;
    };

    MicroGL.prototype.frameCube = function(size, flags) {
      if (size == null) {
        size = this.width;
      }
      if (flags == null) {
        flags = {};
      }
      flags.cube = true;
      return this.frame(size, size, flags);
    };

    MicroGL.prototype.draw = function(type, num) {
      this._rebindTexture();
      if (this._useElementArray) {
        if (num == null) {
          num = this._numElements;
        }
        this.gl.drawElements(this.gl[type || 'TRIANGLES'], num, this.gl.UNSIGNED_SHORT, 0);
      } else {
        if (num == null) {
          num = this._numArrays;
        }
        this.gl.drawArrays(this.gl[type || 'TRIANGLE_STRIP'], 0, num);
      }
      this._drawArg = [type, num];
      return this;
    };

    MicroGL.prototype.drawFrame = function(fb, type, num) {
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fb);
      this.draw(type, num);
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
      return this;
    };

    MicroGL.prototype.drawFrameCube = function(fb, idx, type, num) {
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fb);
      this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + idx, fb.color, 0);
      this.draw(type, num);
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
      return this;
    };

    MicroGL.prototype.clear = function() {
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
      return this;
    };

    MicroGL.prototype.clearFrame = function(fb) {
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fb);
      this.clear();
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
      return this;
    };

    MicroGL.prototype.clearFrameCube = function(fb, idx) {
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fb);
      this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + idx, fb.color, 0);
      this.clear();
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
      return this;
    };

    MicroGL.prototype.read = function() {
      var array, canv, height, width;
      canv = this.gl.canvas;
      width = canv.width;
      height = canv.height;
      array = new Uint8Array(width * height * 4);
      this.gl.readPixels(0, 0, width, height, this.gl.RGBA, this.gl.UNSIGNED_BYTE, array);
      return array;
    };

    return MicroGL;

  })();

  if (typeof window !== "undefined" && window !== null) {
    window.MicroGL = MicroGL;
  }

}).call(this);

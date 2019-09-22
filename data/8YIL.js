(function() {
  var $, IDMAT4, Vec3, detector, get, gl, glHeight, glWidth, init, loadModels, main, makeModelViewMatrix, makePerspective, makeTransformMatrix, markerImage, mikuModel, mikuTexture, models, perspective, showMarker, update, videoModel, webcam;

  IDMAT4 = function() {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  };

  mikuTexture = '../assets/v6IU3.png';

  mikuModel = '../data/jlbs.js';

  markerImage = '../assets/jlrT5.gif';

  /* variables
  */


  perspective = IDMAT4();

  glWidth = glHeight = 0;

  videoModel = {};

  models = [];

  gl = webcam = detector = null;

  /* 3次元ベクトル
  */


  Vec3 = (function() {

    function Vec3(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
    }

    Vec3.prototype.copy = function() {
      return new Vec3(this.x, this.y, this.z);
    };

    Vec3.prototype.add = function(v) {
      return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
    };

    Vec3.prototype.mul = function(a) {
      return new Vec3(this.x * a, this.y * a, this.z * a);
    };

    Vec3.prototype.sub = function(v) {
      return this.add(v.mul(-1));
    };

    Vec3.prototype.dot = function(v) {
      return this.x * v.x + this.y * v.y + this.z * v.z;
    };

    Vec3.prototype.cross = function(v) {
      return new Vec3(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
    };

    Vec3.prototype.len = function() {
      return Math.sqrt(this.dot(this));
    };

    Vec3.prototype.normalize = function() {
      var l;
      if (l = this.len()) {
        return this.mul(1 / l);
      } else {
        return this.copy();
      }
    };

    Vec3.prototype.toArray = function() {
      return [this.x, this.y, this.z];
    };

    Vec3.prototype.toString = function() {
      return 'Vec3(' + this.toArray().join(', ') + ')';
    };

    return Vec3;

  })();

  makeTransformMatrix = function(origin, ex, ey, ez) {
    var a, b, c, d, e, f, g, h, i, j, k, l, _ref;
    _ref = [ex.x, ey.x, ez.x, origin.x, ex.y, ey.y, ez.y, origin.y, ex.z, ey.z, ez.z, origin.z], a = _ref[0], b = _ref[1], c = _ref[2], d = _ref[3], e = _ref[4], f = _ref[5], g = _ref[6], h = _ref[7], i = _ref[8], j = _ref[9], k = _ref[10], l = _ref[11];
    return [a - d, e - h, i - l, 0, b - d, f - h, j - l, 0, c - d, g - h, k - l, 0, d, h, l, 1];
  };

  makeModelViewMatrix = function(fovx, width, height, corners) {
    var depth, det, j, markerAX, markerAY, markerAZ, normalBottom, normalLeft, normalRight, normalTop, p0, p1, p2, proj, projected, q0, rate0, rate1;
    depth = 0.5 * width / Math.tan(fovx / 360 * Math.PI);
    projected = function(jx, jy) {
      return new Vec3(jx - width / 2, jy - height / 2, -depth);
    };
    proj = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = corners.length; _i < _len; _i++) {
        j = corners[_i];
        _results.push(projected(j.x, j.y));
      }
      return _results;
    })();
    normalTop = proj[0].cross(proj[1]);
    normalRight = proj[1].cross(proj[2]);
    normalBottom = proj[2].cross(proj[3]);
    normalLeft = proj[3].cross(proj[0]);
    markerAX = normalTop.cross(normalBottom).normalize();
    markerAY = normalLeft.cross(normalRight).normalize();
    markerAZ = markerAX.cross(markerAY).normalize();
    det = normalTop.z;
    rate1 = proj[0].x * markerAX.y - proj[0].y * markerAX.x;
    rate0 = proj[1].x * markerAX.y - proj[1].y * markerAX.x;
    p0 = proj[0].mul(-rate0 / det);
    p1 = proj[1].mul(-rate1 / det);
    p2 = p0.add(markerAY);
    q0 = p0.add(markerAZ.mul(-1));
    return makeTransformMatrix(p0, p1, p2, q0);
  };

  makePerspective = function(fovx, aspect, near, far) {
    var height, p, width, x, y, z;
    width = 2 * near * Math.tan(fovx * Math.PI / 360);
    height = width / aspect;
    x = 2 * near / width;
    y = 2 * near / height;
    z = (near + far) / (near - far);
    p = 2 * near * far / (near - far);
    return [x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, -1, 0, 0, p, 0];
  };

  $ = function(i) {
    return document.getElementById(i);
  };

  get = function(url, callback) {
    var xhr;
    xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function() {
      return callback(xhr.responseText);
    };
    return xhr.send();
  };

  /* マーカーを表示する
  */


  showMarker = function() {
    var img;
    img = document.createElement('img');
    img.src = markerImage;
    return img.onload = function() {
      return document.body.appendChild(img);
    };
  };

  /* モデルつくる
  */


  loadModels = function(data) {
    var d, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      d = data[_i];
      _results.push(gl.variable({
        uSampler: mikuTexture,
        aPosition: d.position,
        aTexCoord: d.texCoord,
        INDEX: d.index
      }));
    }
    return _results;
  };

  /* 毎フレーム呼ばれる
  */


  update = function() {
    var m, marker, markers, _i, _j, _len, _len1;
    gl.clear();
    gl.bindVars({
      uSampler: webcam.video
    });
    gl.bind(videoModel);
    gl.draw();
    markers = detector.detect({
      data: gl.read(),
      width: glWidth,
      height: glHeight
    });
    for (_i = 0, _len = markers.length; _i < _len; _i++) {
      marker = markers[_i];
      gl.bindVars({
        uPerspective: perspective,
        uModelView: makeModelViewMatrix(60, glWidth, glHeight, marker.corners)
      });
      for (_j = 0, _len1 = models.length; _j < _len1; _j++) {
        m = models[_j];
        gl.bind(m);
        gl.draw();
      }
    }
    return requestAnimationFrame(update);
  };

  /* gl を初期化して update を呼ぶ
  */


  init = function() {
    glWidth = 400;
    glHeight = 400 * webcam.height / webcam.width | 0;
    perspective = makePerspective(60, glWidth / glHeight, 0.1, 100);
    gl.init(document.body, glWidth, glHeight);
    return requestAnimationFrame(update);
  };

  main = function() {
    gl = new MicroGL();
    if (!gl.enabled) {
      return showMarker();
    }
    gl.program($('vshader').textContent, $('fshader').textContent);
    webcam = new WebCam(init, showMarker);
    detector = new AR.Detector();
    videoModel = gl.variable({
      uPerspective: IDMAT4(),
      uModelView: IDMAT4(),
      aPosition: [-1, -1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 1],
      aTexCoord: [0, 0, 0, 1, 1, 0, 1, 1],
      INDEX: null
    });
    return get(mikuModel, function(text) {
      return models = loadModels(JSON.parse(text));
    });
  };

  main();

}).call(this);

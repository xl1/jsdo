(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function(win, doc, exports) {
    var ANGLE, AmbientLight, Camera, Color, Cube, DEG_TO_RAD, DiffuseLight, DirectionalLight, Face, Light, Line, Matrix2, Matrix4, Object3D, PI, Plate, Quaternion, Renderer, Scene, Texture, Triangle, Vector3, Vertex, cos, makeRotatialQuaternion, max, min, sin, sqrt, tan;
    max = Math.max, min = Math.min, sqrt = Math.sqrt, tan = Math.tan, cos = Math.cos, sin = Math.sin, PI = Math.PI;
    DEG_TO_RAD = PI / 180;
    ANGLE = PI * 2;
    Vertex = (function() {

      function Vertex(vertecies) {
        this.vertecies = vertecies;
      }

      Vertex.prototype.getZPosition = function() {
        var cnt, i, ret, v, _i, _len, _ref, _step;
        ret = 0;
        cnt = 0;
        _ref = this.vertecies;
        for (i = _i = 0, _len = _ref.length, _step = 4; _i < _len; i = _i += _step) {
          v = _ref[i];
          cnt++;
          ret += this.vertecies[i + 2] * this.vertecies[i + 3];
        }
        return ret / cnt;
      };

      return Vertex;

    })();
    /**
        Vector3 class
        @constructor
        @param {number} x Position of x.
        @param {number} y Position of y.
        @param {number} z Position of z.
    */

    Vector3 = (function() {

      function Vector3(x, y, z) {
        this.x = x != null ? x : 0;
        this.y = y != null ? y : 0;
        this.z = z != null ? z : 0;
      }

      Vector3.prototype.zero = function() {
        return this.x = this.y = this.z = 0;
      };

      Vector3.prototype.equal = function(v) {
        return (this.x === v.x) && (this.y === v.y) && (this.z === v.z);
      };

      Vector3.prototype.sub = function(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
      };

      Vector3.prototype.subVectors = function(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        return this;
      };

      Vector3.prototype.add = function(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
      };

      Vector3.prototype.addVectors = function(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        return this;
      };

      Vector3.prototype.copy = function(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
      };

      Vector3.prototype.norm = function() {
        return sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
      };

      Vector3.prototype.normalize = function() {
        var nrm;
        nrm = this.norm();
        if (nrm !== 0) {
          nrm = 1 / nrm;
          this.x *= nrm;
          this.y *= nrm;
          this.z *= nrm;
        }
        return this;
      };

      Vector3.prototype.multiply = function(v) {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        return this;
      };

      Vector3.prototype.multiplyScalar = function(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
      };

      Vector3.prototype.multiplyVectors = function(a, b) {
        this.x = a.x * b.x;
        this.y = a.y * b.y;
        return this.z = a.z * b.z;
      };

      Vector3.prototype.dot = function(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
      };

      Vector3.prototype.cross = function(v, w) {
        var x, y, z;
        if (w) {
          return this.crossVectors(v, w);
        }
        x = this.x;
        y = this.y;
        z = this.z;
        this.x = (y * v.z) - (z * v.y);
        this.y = (z * v.x) - (x * v.z);
        this.z = (x * v.y) - (y * v.x);
        return this;
      };

      Vector3.prototype.crossVectors = function(v, w) {
        this.x = (w.y * v.z) - (w.z * v.y);
        this.y = (w.z * v.x) - (w.x * v.z);
        this.z = (w.x * v.y) - (w.y * v.x);
        return this;
      };

      Vector3.prototype.applyMatrix4 = function(m) {
        var e, x, y, z;
        e = m.elements;
        x = this.x;
        y = this.y;
        z = this.z;
        this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
        this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
        this.z = e[2] * x + e[5] * y + e[10] * z + e[14];
        return this;
      };

      /**
          射影投影座標変換
      
          計算された座標変換行列をスクリーンの座標系に変換するために計算する
          基本はスケーリング（&Y軸反転）と平行移動。
          行列で表すと
          w = width  / 2
          h = height / 2
          とすると
                      |w  0  0  0|
          M(screen) = |0 -h  0  0|
                      |0  0  1  0|
                      |w  h  0  1|
      
          4x4の変換行列を対象の1x4行列[x, y, z, 1]に適用する
          1x4行列と4x4行列の掛け算を行う
      
          |@_11 @_12 @_13 @_14|   |x|
          |@_21 @_22 @_23 @_24| x |y|
          |@_31 @_32 @_33 @_34|   |z|
          |@_41 @_42 @_43 @_44|   |1|
      
          @_4nは1x4行列の最後が1のため、ただ足すだけになる
      
          @param {Array.<number>} out
          @param {number} x
          @param {number} y
          @param {number} z
      */


      Vector3.prototype.applyProjection = function(m, out) {
        var e, w, x, y, z, _w, _x, _y, _z;
        x = this.x;
        y = this.y;
        z = this.z;
        e = m.elements;
        w = e[3] * x + e[7] * y + e[11] * z + e[15];
        _w = Math.abs(1 / w);
        _x = e[0] * x + e[4] * y + e[8] * z + e[12];
        _y = e[1] * x + e[5] * y + e[9] * z + e[13];
        _z = e[2] * x + e[6] * y + e[10] * z + e[14];
        this.x = _x * _w;
        this.y = _y * _w;
        this.z = _z * _w;
        out[0] = this;
        out[1] = w;
        return ((-w <= _x && _x <= w)) || ((-w <= _y && _y <= w)) || ((-w <= _z && _z <= w));
      };

      Vector3.prototype.clone = function() {
        var vec3;
        vec3 = new Vector3;
        vec3.copy(this);
        return vec3;
      };

      Vector3.prototype.toArray = function() {
        return [this.x, this.y, this.z];
      };

      Vector3.prototype.toString = function() {
        return "" + this.x + "," + this.y + "," + this.z;
      };

      return Vector3;

    })();
    /**
        Matrix2 class
        @constructor
    */

    Matrix2 = (function() {

      function Matrix2(m11, m12, m21, m22) {
        var te;
        if (m11 == null) {
          m11 = 1;
        }
        if (m12 == null) {
          m12 = 0;
        }
        if (m21 == null) {
          m21 = 0;
        }
        if (m22 == null) {
          m22 = 1;
        }
        this.elements = te = new Float32Array(4);
        te[0] = m11;
        te[2] = m12;
        te[1] = m21;
        te[3] = m22;
      }

      /**
          逆行列を生成
          
          [逆行列の公式]
      
          A = |a b|
              |c d|
      
          について、detA = ad - bc ≠0のときAの逆行列が存在する
      
          A^-1 = | d -b| * 1 / detA
                 |-c  a|
      */


      Matrix2.prototype.getInvert = function() {
        var det, oe, out, te;
        out = new Matrix2();
        oe = out.elements;
        te = this.elements;
        det = te[0] * te[3] - te[2] * te[1];
        if ((0.0001 > det && det > -0.0001)) {
          return null;
        }
        oe[0] = te[3] / det;
        oe[1] = -te[1] / det;
        oe[2] = -te[2] / det;
        oe[3] = te[0] / det;
        return out;
      };

      return Matrix2;

    })();
    /**
        Matrix4 class
        @constructor
        @param {boolean} cpy
    */

    Matrix4 = (function() {

      function Matrix4(cpy) {
        this.elements = new Float32Array(16);
        if (cpy) {
          this.copy(cpy);
        } else {
          this.identity();
        }
      }

      Matrix4.prototype.identity = function() {
        var te;
        te = this.elements;
        te[0] = 1;
        te[4] = 0;
        te[8] = 0;
        te[12] = 0;
        te[1] = 0;
        te[5] = 1;
        te[9] = 0;
        te[13] = 0;
        te[2] = 0;
        te[6] = 0;
        te[10] = 1;
        te[14] = 0;
        te[3] = 0;
        te[7] = 0;
        te[11] = 0;
        te[15] = 1;
        return this;
      };

      Matrix4.prototype.equal = function(m) {
        var me, te;
        te = this.elements;
        me = m.elements;
        return (te[0] === me[0]) && (te[4] === me[4]) && (te[8] === me[8]) && (te[12] === me[12]) && (te[1] === me[1]) && (te[5] === me[5]) && (te[9] === me[9]) && (te[13] === me[13]) && (te[2] === me[2]) && (te[6] === me[6]) && (te[10] === me[10]) && (te[14] === me[14]) && (te[3] === me[3]) && (te[7] === me[7]) && (te[11] === me[11]) && (te[15] === me[15]);
      };

      Matrix4.prototype.getInvert = function() {
        var a11, a12, a13, a14, a21, a22, a23, a24, a31, a32, a33, a34, a41, a42, a43, a44, b11, b12, b13, b14, b21, b22, b23, b24, b31, b32, b33, b34, b41, b42, b43, b44, det, oe, out, te;
        out = new Matrix4;
        oe = out.elements;
        te = this.elements;
        a11 = te[0];
        a12 = te[4];
        a13 = te[8];
        a14 = te[12];
        a21 = te[1];
        a22 = te[5];
        a23 = te[9];
        a24 = te[13];
        a31 = te[2];
        a32 = te[6];
        a33 = te[10];
        a34 = te[14];
        a41 = te[3];
        a42 = te[7];
        a43 = te[11];
        a44 = te[15];
        det = (a11 * a22 * a33 * a44, +a11 * a23 * a34 * a42, +a11 * a24 * a32 * a43, +a12 * a21 * a34 * a43, +a12 * a23 * a31 * a44, +a12 * a24 * a33 * a41, +a13 * a21 * a32 * a44, +a13 * a22 * a34 * a41, +a13 * a24 * a31 * a42, +a14 * a21 * a33 * a42, +a14 * a22 * a31 * a43, +a14 * a23 * a32 * a41, -a11 * a22 * a34 * a43, -a11 * a23 * a32 * a44, -a11 * a24 * a33 * a42, -a12 * a21 * a33 * a44, -a12 * a23 * a34 * a41, -a12 * a24 * a31 * a43, -a13 * a21 * a34 * a42, -a13 * a22 * a31 * a44, -a13 * a24 * a32 * a41, -a14 * a21 * a32 * a43, -a14 * a22 * a33 * a41, -a14 * a23 * a31 * a42);
        if ((0.0001 > det && det > -0.0001)) {
          return null;
        }
        b11 = ((a22 * a33 * a44) + (a23 * a34 * a42) + (a24 * a32 * a43) - (a22 * a34 * a43) - (a23 * a32 * a44) - (a24 * a33 * a42)) / det;
        b12 = ((a12 * a34 * a43) + (a13 * a32 * a44) + (a14 * a33 * a42) - (a12 * a33 * a44) - (a13 * a34 * a42) - (a14 * a32 * a43)) / det;
        b13 = ((a12 * a23 * a44) + (a13 * a24 * a42) + (a14 * a22 * a43) - (a12 * a24 * a43) - (a13 * a22 * a44) - (a14 * a23 * a42)) / det;
        b14 = ((a12 * a24 * a33) + (a13 * a22 * a34) + (a14 * a23 * a32) - (a12 * a23 * a34) - (a13 * a24 * a32) - (a14 * a22 * a33)) / det;
        b21 = ((a21 * a34 * a43) + (a23 * a31 * a44) + (a24 * a33 * a41) - (a21 * a33 * a44) - (a23 * a34 * a41) - (a24 * a31 * a43)) / det;
        b22 = ((a11 * a33 * a44) + (a13 * a34 * a41) + (a14 * a31 * a43) - (a11 * a34 * a43) - (a13 * a31 * a44) - (a14 * a33 * a41)) / det;
        b23 = ((a11 * a24 * a43) + (a13 * a21 * a44) + (a14 * a23 * a41) - (a11 * a23 * a44) - (a13 * a24 * a41) - (a14 * a21 * a43)) / det;
        b24 = ((a11 * a23 * a34) + (a13 * a24 * a31) + (a14 * a21 * a33) - (a11 * a24 * a33) - (a13 * a21 * a34) - (a14 * a23 * a31)) / det;
        b31 = ((a21 * a32 * a44) + (a22 * a34 * a41) + (a24 * a31 * a42) - (a21 * a34 * a42) - (a22 * a31 * a44) - (a24 * a32 * a41)) / det;
        b32 = ((a11 * a34 * a42) + (a12 * a31 * a44) + (a14 * a32 * a41) - (a11 * a32 * a44) - (a12 * a34 * a41) - (a14 * a31 * a42)) / det;
        b33 = ((a11 * a22 * a44) + (a12 * a24 * a41) + (a14 * a21 * a42) - (a11 * a24 * a42) - (a12 * a21 * a44) - (a14 * a22 * a41)) / det;
        b34 = ((a11 * a24 * a32) + (a12 * a21 * a34) + (a14 * a22 * a31) - (a11 * a22 * a34) - (a12 * a24 * a31) - (a14 * a21 * a32)) / det;
        b41 = ((a21 * a33 * a42) + (a22 * a31 * a43) + (a23 * a32 * a41) - (a21 * a32 * a43) - (a22 * a33 * a41) - (a23 * a31 * a42)) / det;
        b42 = ((a11 * a32 * a43) + (a12 * a33 * a41) + (a13 * a31 * a42) - (a11 * a33 * a42) - (a12 * a31 * a43) - (a13 * a32 * a41)) / det;
        b43 = ((a11 * a23 * a42) + (a12 * a21 * a43) + (a13 * a22 * a41) - (a11 * a22 * a43) - (a12 * a23 * a41) - (a13 * a21 * a42)) / det;
        b44 = ((a11 * a22 * a33) + (a12 * a23 * a31) + (a13 * a21 * a32) - (a11 * a23 * a32) - (a12 * a21 * a33) - (a13 * a22 * a31)) / det;
        oe[0] = b11;
        oe[4] = b12;
        oe[8] = b13;
        oe[12] = b14;
        oe[1] = b21;
        oe[5] = b22;
        oe[9] = b23;
        oe[13] = b24;
        oe[2] = b31;
        oe[6] = b32;
        oe[10] = b33;
        oe[14] = b34;
        oe[3] = b41;
        oe[7] = b42;
        oe[11] = b43;
        oe[15] = b44;
        return out;
      };

      /**
          Copy from `m`
          @param {Matrix4} m
      */


      Matrix4.prototype.copy = function(m) {
        this.elements = m.elements.subarray();
        return this;
      };

      Matrix4.prototype.makeFrustum = function(left, right, bottom, top, near, far) {
        var a, b, c, d, te, vh, vw, x, y;
        te = this.elements;
        vw = right - left;
        vh = top - bottom;
        x = 2 * near / vw;
        y = 2 * near / vh;
        a = (right + left) / (right - left);
        b = (top + bottom) / (top - bottom);
        c = -(far + near) / (far - near);
        d = -(2 * near * far) / (far - near);
        te[0] = x;
        te[4] = 0;
        te[8] = a;
        te[12] = 0;
        te[1] = 0;
        te[5] = y;
        te[9] = b;
        te[13] = 0;
        te[2] = 0;
        te[6] = 0;
        te[10] = c;
        te[14] = d;
        te[3] = 0;
        te[7] = 0;
        te[11] = -1;
        te[15] = 0;
        return this;
      };

      Matrix4.prototype.perspectiveLH = function(fov, aspect, near, far) {
        var tmp;
        tmp = Matrix4.perspectiveLH(fov, aspect, near, far);
        return this.copy(tmp);
      };

      Matrix4.perspectiveLH = function(fov, aspect, near, far) {
        var te, tmp, xmax, xmin, ymax, ymin;
        tmp = new Matrix4;
        te = tmp.elements;
        ymax = near * tan(fov * DEG_TO_RAD * 0.5);
        ymin = -ymax;
        xmin = ymin * aspect;
        xmax = ymax * aspect;
        return tmp.makeFrustum(xmin, xmax, ymin, ymax, near, far);
      };

      Matrix4.prototype.multiply = function(A) {
        var tmp;
        tmp = Matrix4.multiply(this, A);
        this.copy(tmp);
        return this;
      };

      Matrix4.multiply = function(A, B) {
        var A11, A12, A13, A14, A21, A22, A23, A24, A31, A32, A33, A34, A41, A42, A43, A44, B11, B12, B13, B14, B21, B22, B23, B24, B31, B32, B33, B34, B41, B42, B43, B44, ae, be, te, tmp;
        ae = A.elements;
        be = B.elements;
        A11 = ae[0];
        A12 = ae[4];
        A13 = ae[8];
        A14 = ae[12];
        A21 = ae[1];
        A22 = ae[5];
        A23 = ae[9];
        A24 = ae[13];
        A31 = ae[2];
        A32 = ae[6];
        A33 = ae[10];
        A34 = ae[14];
        A41 = ae[3];
        A42 = ae[7];
        A43 = ae[11];
        A44 = ae[15];
        B11 = be[0];
        B12 = be[4];
        B13 = be[8];
        B14 = be[12];
        B21 = be[1];
        B22 = be[5];
        B23 = be[9];
        B24 = be[13];
        B31 = be[2];
        B32 = be[6];
        B33 = be[10];
        B34 = be[14];
        B41 = be[3];
        B42 = be[7];
        B43 = be[11];
        B44 = be[15];
        tmp = new Matrix4;
        te = tmp.elements;
        te[0] = A11 * B11 + A12 * B21 + A13 * B31 + A14 * B41;
        te[4] = A11 * B12 + A12 * B22 + A13 * B32 + A14 * B42;
        te[8] = A11 * B13 + A12 * B23 + A13 * B33 + A14 * B43;
        te[12] = A11 * B14 + A12 * B24 + A13 * B34 + A14 * B44;
        te[1] = A21 * B11 + A22 * B21 + A23 * B31 + A24 * B41;
        te[5] = A21 * B12 + A22 * B22 + A23 * B32 + A24 * B42;
        te[9] = A21 * B13 + A22 * B23 + A23 * B33 + A24 * B43;
        te[13] = A21 * B14 + A22 * B24 + A23 * B34 + A24 * B44;
        te[2] = A31 * B11 + A32 * B21 + A33 * B31 + A34 * B41;
        te[6] = A31 * B12 + A32 * B22 + A33 * B32 + A34 * B42;
        te[10] = A31 * B13 + A32 * B23 + A33 * B33 + A34 * B43;
        te[14] = A31 * B14 + A32 * B24 + A33 * B34 + A34 * B44;
        te[3] = A41 * B11 + A42 * B21 + A43 * B31 + A44 * B41;
        te[7] = A41 * B12 + A42 * B22 + A43 * B32 + A44 * B42;
        te[11] = A41 * B13 + A42 * B23 + A43 * B33 + A44 * B43;
        te[15] = A41 * B14 + A42 * B24 + A43 * B34 + A44 * B44;
        return tmp;
      };

      /**
          Multiply Matrices
          A, Bふたつの行列の掛け算した結果をthisに保存
          @param {Matrix4} A.
          @param {Matrix4} B.
      */


      Matrix4.prototype.multiplyMatrices = function(A, B) {
        var tmp;
        tmp = Matrix4.multiply(A, B);
        this.copy(tmp);
        return this;
      };

      /**
          @param {Vector3} v
      */


      Matrix4.prototype.translate = function(v) {
        var te, x, y, z;
        te = this.elements;
        x = v.x;
        y = v.y;
        z = v.z;
        te[0] = 1;
        te[4] = 0;
        te[8] = 0;
        te[12] = x;
        te[1] = 0;
        te[5] = 1;
        te[9] = 0;
        te[13] = y;
        te[2] = 0;
        te[6] = 0;
        te[10] = 1;
        te[14] = z;
        te[3] = 0;
        te[7] = 0;
        te[11] = 0;
        te[15] = 1;
        return this;
      };

      /**
          @param {Vector3} eye
          @param {Vector3} target
          @param {Vector3} up
      */


      Matrix4.prototype.lookAt = (function() {
        var x, y, z;
        x = new Vector3;
        y = new Vector3;
        z = new Vector3;
        return function(eye, target, up) {
          var te, tx, ty, tz;
          te = this.elements;
          z.subVectors(eye, target).normalize();
          x.crossVectors(z, up).normalize();
          y.crossVectors(x, z).normalize();
          tx = eye.dot(x);
          ty = eye.dot(y);
          tz = eye.dot(z);
          te[0] = x.x;
          te[4] = x.y;
          te[8] = x.z;
          te[12] = -tx;
          te[1] = y.x;
          te[5] = y.y;
          te[9] = y.z;
          te[13] = -ty;
          te[2] = z.x;
          te[6] = z.y;
          te[10] = z.z;
          te[14] = -tz;
          return this;
        };
      })();

      /**
          @param {number} r Rotate X
      */


      Matrix4.prototype.rotationX = function(r) {
        var c, s, te;
        te = this.elements;
        c = cos(r);
        s = sin(r);
        te[0] = 1;
        te[4] = 0;
        te[8] = 0;
        te[12] = 0;
        te[1] = 0;
        te[5] = c;
        te[9] = -s;
        te[13] = 0;
        te[2] = 0;
        te[6] = s;
        te[10] = c;
        te[14] = 0;
        te[3] = 0;
        te[7] = 0;
        te[11] = 0;
        te[15] = 1;
        return this;
      };

      /**
          @param {number} r Rotate Y
      */


      Matrix4.prototype.rotationY = function(r) {
        var c, s, te;
        te = this.elements;
        c = cos(r);
        s = sin(r);
        te[0] = c;
        te[4] = 0;
        te[8] = s;
        te[12] = 0;
        te[1] = 0;
        te[5] = 1;
        te[9] = 0;
        te[13] = 0;
        te[2] = -s;
        te[6] = 0;
        te[10] = c;
        te[14] = 0;
        te[3] = 0;
        te[7] = 0;
        te[11] = 0;
        te[15] = 1;
        return this;
      };

      /**
          @param {number} r Rotate Z
      */


      Matrix4.prototype.rotationZ = function(r) {
        var c, s, te;
        te = this.elements;
        c = cos(r);
        s = sin(r);
        te[0] = c;
        te[4] = -s;
        te[8] = 0;
        te[12] = 0;
        te[1] = s;
        te[5] = c;
        te[9] = 0;
        te[13] = 0;
        te[2] = 0;
        te[6] = 0;
        te[10] = 1;
        te[14] = 0;
        te[3] = 0;
        te[7] = 0;
        te[11] = 0;
        te[15] = 1;
        return this;
      };

      Matrix4.prototype.clone = function() {
        var tmp;
        tmp = new Matrix4;
        tmp.copy(this);
        return tmp;
      };

      return Matrix4;

    })();
    Object3D = (function() {

      function Object3D() {
        this.parent = null;
        this.children = [];
        this.vertices = [];
        this.position = new Vector3;
        this.rotation = new Vector3;
        this.up = new Vector3(0, 1, 0);
        this.matrixTranslate = new Matrix4;
        this.matrixRotation = new Matrix4;
        this.matrix = new Matrix4;
        this.matrixWorld = new Matrix4;
        this.updateMatrix();
      }

      Object3D.prototype.updateTranslate = (function() {
        var previous, tm;
        tm = new Matrix4;
        previous = null;
        return function() {
          if (previous && this.position.equal(previous)) {
            return false;
          }
          previous = this.position.clone();
          this.matrixTranslate = tm.clone().translate(this.position);
          return true;
        };
      })();

      Object3D.prototype.updateRotation = (function() {
        var previous, rmx, rmy, rmz;
        rmx = new Matrix4;
        rmy = new Matrix4;
        rmz = new Matrix4;
        previous = null;
        return function() {
          var tmp, x, y, z;
          if (previous && this.rotation.equal(previous)) {
            return false;
          }
          x = this.rotation.x * DEG_TO_RAD;
          y = this.rotation.y * DEG_TO_RAD;
          z = this.rotation.z * DEG_TO_RAD;
          tmp = new Matrix4;
          rmx.rotationX(x);
          rmy.rotationY(y);
          rmz.rotationZ(z);
          tmp.multiplyMatrices(rmx, rmy);
          tmp.multiply(rmz);
          previous = this.rotation.clone();
          this.matrixRotation = tmp;
          return true;
        };
      })();

      Object3D.prototype.updateMatrix = function() {
        var c, updatedRotation, updatedTranslate, _i, _len, _ref, _results;
        updatedRotation = this.updateRotation();
        updatedTranslate = this.updateTranslate();
        if (updatedRotation || updatedTranslate) {
          this.matrix.multiplyMatrices(this.matrixTranslate, this.matrixRotation);
        }
        _ref = this.children;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          c = _ref[_i];
          _results.push(c.updateMatrix());
        }
        return _results;
      };

      Object3D.prototype.updateMatrixWorld = function(force) {
        var c, _i, _len, _ref, _results;
        if (!this.parent) {
          this.matrixWorld.copy(this.matrix);
        } else {
          this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix);
        }
        _ref = this.children;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          c = _ref[_i];
          _results.push(c.updateMatrixWorld());
        }
        return _results;
      };

      Object3D.prototype.getVerticesByProjectionMatrix = function(m) {
        var inFrustum, ret, tmp, v, wm, _i, _len, _ref;
        ret = [];
        inFrustum = false;
        wm = Matrix4.multiply(m, this.matrixWorld);
        _ref = this.vertices;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          v = _ref[_i];
          tmp = [];
          inFrustum = v.clone().applyProjection(wm, tmp) || inFrustum;
          ret = ret.concat(tmp[0].toArray().concat(tmp[1]));
        }
        if (inFrustum) {
          return ret;
        } else {
          return [];
        }
      };

      Object3D.prototype.add = function(object) {
        var _ref;
        if (this === object) {
          return null;
        }
        if ((_ref = object.parent) != null) {
          _ref.remove(object);
        }
        this.children.push(object);
        return object.parent = this;
      };

      Object3D.prototype.remove = function(object) {
        var index, ret;
        if (this === object) {
          return null;
        }
        index = this.children.indexOf(object);
        if (index === -1) {
          return null;
        }
        return ret = this.children.splice(index, 1);
      };

      return Object3D;

    })();
    /**
        Camera class
        @constructor
        @param {number} fov Field of view.
        @param {number} aspect Aspect ratio.
        @param {number} near Near clip.
        @param {number} far far clip.
        @param {Vector3} position Position vector.
    */

    Camera = (function(_super) {

      __extends(Camera, _super);

      function Camera(fov, aspect, near, far, position) {
        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;
        this.position = position != null ? position : new Vector3(0, 0, 20);
        Camera.__super__.constructor.apply(this, arguments);
        this.viewMatrix = new Matrix4;
        this.projectionMatrix = new Matrix4;
      }

      Camera.prototype.setWorld = function(m) {
        return this.matrixWorld = m;
      };

      Camera.prototype.getProjectionMatrix = function() {
        var tmp;
        tmp = Matrix4.multiply(this.projectionMatrix, this.viewMatrix);
        return tmp.multiply(this.matrixWorld);
      };

      Camera.prototype.updateProjectionMatrix = function() {
        this.lookAt();
        return this.projectionMatrix.perspectiveLH(this.fov, this.aspect, this.near, this.far);
      };

      Camera.prototype.lookAt = (function() {
        var m1;
        m1 = new Matrix4;
        return function(vector) {
          this.vector = vector || this.vector || new Vector3;
          m1.lookAt(this.position, this.vector, this.up);
          return this.viewMatrix.copy(m1);
        };
      })();

      return Camera;

    })(Object3D);
    /**
        Line class
            Line -> Object3D
        @constructor
        @param {Vector3} vec1
        @param {Vector3} vec2
    */

    Line = (function(_super) {

      __extends(Line, _super);

      function Line(x1, y1, z1, x2, y2, z2, color) {
        this.color = color != null ? color : new Color(255, 255, 255, 1);
        Line.__super__.constructor.apply(this, arguments);
        this.vertices.push(new Vector3(x1, y1, z1));
        this.vertices.push(new Vector3(x2, y2, z2));
      }

      return Line;

    })(Object3D);
    /**
        Triangle class
            Triangle -> Object3D
        @constructor
        @param {Array} vertecies
        @param {Texture} texture
    */

    Triangle = (function(_super) {

      __extends(Triangle, _super);

      function Triangle(vertices, texture) {
        var i, v, vec3, _i, _len, _step;
        this.texture = texture;
        Triangle.__super__.constructor.apply(this, arguments);
        this.vertices = [];
        for (i = _i = 0, _len = vertices.length, _step = 3; _i < _len; i = _i += _step) {
          v = vertices[i];
          vec3 = new Vector3(vertices[i + 0], vertices[i + 1], vertices[i + 2]);
          this.vertices.push(vec3);
        }
      }

      Triangle.prototype.getNormal = (function() {
        var a, b;
        a = new Vector3;
        b = new Vector3;
        return function() {
          a.subVectors(this.vertices[1], this.vertices[0]);
          b.subVectors(this.vertices[2], this.vertices[0]);
          return a.clone().cross(b).applyMatrix4(this.matrixWorld).normalize();
        };
      })();

      return Triangle;

    })(Object3D);
    /**
        Face class
            Face -> Object3D
        @constructor
        @param {number} x1
        @param {number} y1
        @param {number} x2
        @param {number} y2
        @param {Texture} texture1
        @param {Texture} texture2
    */

    Face = (function(_super) {

      __extends(Face, _super);

      function Face(x1, y1, x2, y2, texture1, texture2) {
        var triangle1, triangle2;
        Face.__super__.constructor.apply(this, arguments);
        triangle1 = new Triangle([x1, y1, 0, x1, y2, 0, x2, y1, 0], texture1);
        this.add(triangle1);
        triangle2 = new Triangle([x1, y2, 0, x2, y2, 0, x2, y1, 0], texture2);
        this.add(triangle2);
      }

      return Face;

    })(Object3D);
    /**
        Plate class
            Plate -> Object3D
        @constructor
        @param {number} width
        @param {number} height
        @param {Texture} texture1
        @param {Texture} texture2
    */

    Plate = (function(_super) {

      __extends(Plate, _super);

      function Plate(width, height, texture1, texture2) {
        var face1, face2, hh, hw;
        Plate.__super__.constructor.apply(this, arguments);
        hw = width * 0.5;
        hh = height * 0.5;
        face1 = new Face(-hw, hh, hw, -hh, texture1, texture2);
        face2 = new Face(-hw, hh, hw, -hh, texture1, texture2);
        face2.rotation.y = 180;
        this.add(face1);
        this.add(face2);
      }

      return Plate;

    })(Object3D);
    /**
        Cube class
        @constructor
        @param {number} w width.
        @param {number} h height.
        @param {number} p profound.
        @param {number} sx divide as x axis.
        @param {number} sy divide as y axis.
        @param {number} sz divide as z axis.
        @param {<Array.<Texture>} materials texture materials.
    */

    Cube = (function(_super) {

      __extends(Cube, _super);

      function Cube(w, h, p, sx, sy, sz, materials) {
        var backFace, bottomFace, frontFace, leftFace, rightFace, topFace;
        if (sx == null) {
          sx = 1;
        }
        if (sy == null) {
          sy = 1;
        }
        if (sz == null) {
          sz = 1;
        }
        Cube.__super__.constructor.apply(this, arguments);
        w *= 0.5;
        h *= 0.5;
        p *= 0.5;
        topFace = new Face(-w, h, w, -h, materials[0], materials[1]);
        topFace.rotation.x = -90;
        topFace.position.y = h;
        bottomFace = new Face(-w, h, w, -h, materials[2], materials[3]);
        bottomFace.rotation.x = 90;
        bottomFace.position.y = -h;
        frontFace = new Face(-w, h, w, -h, materials[4], materials[5]);
        frontFace.position.z = p;
        backFace = new Face(-w, h, w, -h, materials[6], materials[7]);
        backFace.rotation.y = 180;
        backFace.position.z = -p;
        leftFace = new Face(-p, h, p, -h, materials[8], materials[9]);
        leftFace.rotation.y = -90;
        leftFace.position.x = -w;
        rightFace = new Face(-p, h, p, -h, materials[10], materials[11]);
        rightFace.rotation.y = 90;
        rightFace.position.x = w;
        this.add(rightFace);
        this.add(leftFace);
        this.add(backFace);
        this.add(frontFace);
        this.add(bottomFace);
        this.add(topFace);
      }

      return Cube;

    })(Object3D);
    Texture = (function() {

      function Texture(uv_data, uv_list) {
        this.uv_data = uv_data;
        this.uv_list = uv_list;
      }

      return Texture;

    })();
    Color = (function() {

      function Color(r, g, b, a) {
        var d;
        if (r == null) {
          r = 0;
        }
        if (g == null) {
          g = 0;
        }
        if (b == null) {
          b = 0;
        }
        this.a = a != null ? a : 1;
        d = 1 / 255;
        this.r = r * d;
        this.g = g * d;
        this.b = b * d;
      }

      Color.prototype.copy = function(c) {
        this.r = c.r;
        this.g = c.g;
        this.b = c.b;
        this.a = c.a;
        return this;
      };

      Color.prototype.add = function(c) {
        this.r = min(this.r + c.r, 1);
        this.g = min(this.g + c.g, 1);
        this.b = min(this.b + c.b, 1);
        this.a = min(this.a + c.a, 1);
        return this;
      };

      Color.prototype.sub = function(c) {
        this.r = max(this.r - c.r, 0);
        this.g = max(this.g - c.g, 0);
        this.b = max(this.b - c.b, 0);
        this.a = max(this.a - c.a, 0);
        return this;
      };

      Color.prototype.multiplyScalar = function(s) {
        this.r *= s;
        this.g *= s;
        this.b *= s;
        this.a *= s;
        return this;
      };

      Color.prototype.clone = function() {
        var tmp;
        tmp = new Color;
        tmp.copy(this);
        return tmp;
      };

      Color.prototype.toString = function() {
        var a, b, g, r;
        r = ~~min(this.r * 255, 255);
        g = ~~min(this.g * 255, 255);
        b = ~~min(this.b * 255, 255);
        a = min(this.a, 1);
        return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
      };

      return Color;

    })();
    Light = (function(_super) {

      __extends(Light, _super);

      function Light(strength) {
        this.strength = strength;
        Light.__super__.constructor.apply(this, arguments);
      }

      return Light;

    })(Object3D);
    AmbientLight = (function(_super) {

      __extends(AmbientLight, _super);

      function AmbientLight(strength) {
        AmbientLight.__super__.constructor.apply(this, arguments);
      }

      return AmbientLight;

    })(Light);
    DiffuseLight = (function(_super) {

      __extends(DiffuseLight, _super);

      function DiffuseLight(strength, vector) {
        DiffuseLight.__super__.constructor.apply(this, arguments);
      }

      return DiffuseLight;

    })(Light);
    DirectionalLight = (function(_super) {

      __extends(DirectionalLight, _super);

      function DirectionalLight(strength, direction) {
        this.direction = direction;
        DirectionalLight.__super__.constructor.apply(this, arguments);
      }

      return DirectionalLight;

    })(Light);
    Scene = (function() {

      function Scene() {
        this.lights = [];
        this.materials = [];
      }

      Scene.prototype.add = function(material) {
        if (material instanceof Light) {
          return this.lights.push(material);
        } else if (material instanceof Object3D) {
          return this.materials.push(material);
        }
      };

      Scene.prototype.update = function() {
        var m, _i, _len, _ref, _results;
        _ref = this.materials;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          m = _ref[_i];
          m.updateMatrix();
          _results.push(m.updateMatrixWorld());
        }
        return _results;
      };

      return Scene;

    })();
    Renderer = (function() {

      function Renderer(cv, clearColor) {
        this.cv = cv;
        this.clearColor = clearColor != null ? clearColor : '#fff';
        this._dummyCv = doc.createElement('canvas');
        this._dummyG = this._dummyCv.getContext('2d');
        this.g = cv.getContext('2d');
        this.w = this._dummyCv.width = cv.width;
        this.h = this._dummyCv.height = cv.height;
        this.fog = true;
        this.lighting = true;
        this.fogColor = this.clearColor;
        this.fogStart = 200;
        this.fogEnd = 1000;
      }

      Renderer.prototype.render = function(scene, camera) {
        var lights, matProj, vertecies;
        camera.updateProjectionMatrix();
        matProj = camera.getProjectionMatrix();
        this.g.beginPath();
        this.g.fillStyle = this.clearColor;
        this.g.fillRect(0, 0, this.w, this.h);
        scene.update();
        lights = scene.lights;
        vertecies = this.getTransformedPoint(matProj, scene.materials);
        return this.drawTriangles(this.g, vertecies, lights, this.w, this.h);
      };

      Renderer.prototype.drawTriangles = function(g, vertecies, lights, vw, vh) {
        var Ax, Ay, Bx, By, L, N, a, b, c, color, d, dcv, dg, factor, fog, fogColor, fogEnd, fogStart, fogStrength, height, hvh, hvw, i, img, l, lighting, m, me, mi, mie, normal, strength, uvList, v, vertexList, w1, w2, w3, width, x1, x2, x3, y1, y2, y3, z, z1, z2, z3, _Ax, _Ay, _Az, _Bx, _By, _Bz, _i, _j, _len, _len1, _results;
        fogColor = this.fogColor;
        fogStart = this.fogStart;
        fogEnd = this.fogEnd;
        fog = this.fog;
        lighting = this.lighting;
        dcv = this._dummyCv;
        dg = this._dummyG;
        _results = [];
        for (i = _i = 0, _len = vertecies.length; _i < _len; i = ++_i) {
          v = vertecies[i];
          img = v.uvData;
          uvList = v.uvList;
          vertexList = v.vertecies;
          z = v.getZPosition();
          fogStrength = 0;
          normal = v.normal;
          hvw = vw * 0.5;
          hvh = vh * 0.5;
          x1 = (vertexList[0] * hvw) + hvw;
          y1 = (vertexList[1] * -hvh) + hvh;
          z1 = vertexList[2];
          w1 = vertexList[3];
          x2 = (vertexList[4] * hvw) + hvw;
          y2 = (vertexList[5] * -hvh) + hvh;
          z2 = vertexList[6];
          w2 = vertexList[7];
          x3 = (vertexList[8] * hvw) + hvw;
          y3 = (vertexList[9] * -hvh) + hvh;
          z3 = vertexList[10];
          w3 = vertexList[11];
          if (!img) {
            g.save();
            if (fog) {
              fogStrength = (fogEnd - z) / (fogEnd - fogStart);
              if (fogStrength < 0) {
                fogStrength = 0;
              }
              g.globalAlpha = fogStrength;
            }
            g.beginPath();
            g.moveTo(x1, y1);
            g.lineTo(x2, y2);
            g.closePath();
            g.strokeStyle = v.color.toString();
            g.stroke();
            g.restore();
            continue;
          }
          width = dcv.width = img.width || img.videoWidth || 0;
          height = dcv.height = img.height || img.videoHeight || 0;
          _Ax = x2 - x1;
          _Ay = y2 - y1;
          _Az = z2 - z1;
          _Bx = x3 - x1;
          _By = y3 - y1;
          _Bz = z3 - z1;
          if ((_Ax * _By) - (_Ay * _Bx) > 0) {
            continue;
          }
          Ax = (uvList[2] - uvList[0]) * width;
          Ay = (uvList[3] - uvList[1]) * height;
          Bx = (uvList[4] - uvList[0]) * width;
          By = (uvList[5] - uvList[1]) * height;
          m = new Matrix2(Ax, Ay, Bx, By);
          me = m.elements;
          mi = m.getInvert();
          if (!mi) {
            continue;
          }
          mie = mi.elements;
          a = mie[0] * _Ax + mie[2] * _Bx;
          c = mie[1] * _Ax + mie[3] * _Bx;
          b = mie[0] * _Ay + mie[2] * _By;
          d = mie[1] * _Ay + mie[3] * _By;
          g.save();
          dg.save();
          dg.drawImage(img, 0, 0);
          if (lighting) {
            strength = 0;
            color = new Color(0, 0, 0, 1);
            for (_j = 0, _len1 = lights.length; _j < _len1; _j++) {
              l = lights[_j];
              if (l instanceof AmbientLight) {
                strength += l.strength;
              } else if (l instanceof DirectionalLight) {
                L = l.direction;
                N = normal.clone().add(L);
                factor = N.dot(L);
                strength += l.strength * factor;
              }
            }
            color.a -= strength;
            if (color.a > 0) {
              dg.fillStyle = color.toString();
              dg.fillRect(0, 0, width, height);
            }
          }
          if (fog) {
            fogStrength = 1 - ((fogEnd - z) / (fogEnd - fogStart));
            if (fogStrength < 0) {
              fogStrength = 0;
            }
            dg.globalAlpha = fogStrength;
            dg.globalCompositeOperation = 'source-over';
            dg.fillStyle = fogColor;
            dg.fillRect(0, 0, width, height);
          }
          g.beginPath();
          g.moveTo(x1, y1);
          g.lineTo(x2, y2);
          g.lineTo(x3, y3);
          g.closePath();
          if (this.wireframe) {
            g.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            g.stroke();
          }
          g.clip();
          g.transform(a, b, c, d, x1 - (a * uvList[0] * width + c * uvList[1] * height), y1 - (b * uvList[0] * width + d * uvList[1] * height));
          g.drawImage(dcv, 0, 0);
          dg.clearRect(0, 0, width, height);
          dg.restore();
          _results.push(g.restore());
        }
        return _results;
      };

      Renderer.prototype.getTransformedPoint = function(mat, materials) {
        var m, results, tmp, uvData, uvList, vertecies, vertex, _i, _len;
        results = [];
        for (_i = 0, _len = materials.length; _i < _len; _i++) {
          m = materials[_i];
          if (m instanceof Triangle) {
            vertecies = m.getVerticesByProjectionMatrix(mat);
            uvData = m.texture.uv_data;
            uvList = m.texture.uv_list;
            vertex = new Vertex(vertecies);
            vertex.uvData = uvData;
            vertex.uvList = uvList;
            if (vertex.getZPosition() < 0) {
              continue;
            }
            vertex.normal = m.getNormal();
            results.push(vertex);
          } else if (m instanceof Line) {
            vertecies = m.getVerticesByProjectionMatrix(mat);
            vertex = new Vertex(vertecies);
            vertex.color = m.color;
            if (vertex.getZPosition() < 0) {
              continue;
            }
            results.push(vertex);
          } else {
            tmp = this.getTransformedPoint(mat, m.children);
            results = results.concat(tmp);
          }
        }
        results.sort(function(a, b) {
          return b.getZPosition() - a.getZPosition();
        });
        return results;
      };

      return Renderer;

    })();
    Quaternion = (function() {

      function Quaternion(t, v) {
        this.t = t != null ? t : 0;
        this.v = v;
      }

      Quaternion.prototype.set = function(t, v) {
        this.t = t;
        this.v = v;
      };

      Quaternion.prototype.multiply = function(A) {
        return Quaternion.multiply(this, A);
      };

      Quaternion.multiply = function(A, B) {
        var Av, Bv, d1, d2, d3, d4, t, x, y, z;
        Av = A.v;
        Bv = B.v;
        d1 = A.t * B.t;
        d2 = -Av.x * Bv.x;
        d3 = -Av.y * Bv.y;
        d4 = -Av.z * Bv.z;
        t = parseFloat((d1 + d2 + d3 + d4).toFixed(5));
        d1 = (A.t * Bv.x) + (B.t * Av.x);
        d2 = (Av.y * Bv.z) - (Av.z * Bv.y);
        x = parseFloat((d1 + d2).toFixed(5));
        d1 = (A.t * Bv.y) + (B.t * Av.y);
        d2 = (Av.z * Bv.x) - (Av.x * Bv.z);
        y = parseFloat((d1 + d2).toFixed(5));
        d1 = (A.t * Bv.z) + (B.t * Av.z);
        d2 = (Av.x * Bv.y) - (Av.y * Bv.x);
        z = parseFloat((d1 + d2).toFixed(5));
        return new Quaternion(t, new Vector3(x, y, z));
      };

      return Quaternion;

    })();
    /**
        Make rotation quaternion
        @param {number} radian.
        @param {Vector3} vector.
    */

    makeRotatialQuaternion = function(radian, vector) {
      var axis, ccc, norm, ret, sss, t;
      ret = new Quaternion;
      ccc = 0;
      sss = 0;
      axis = new Vector3;
      axis.copy(vector);
      norm = vector.norm();
      if (norm <= 0.0) {
        return ret;
      }
      axis.normalize();
      ccc = cos(0.5 * radian);
      sss = sin(0.5 * radian);
      t = ccc;
      axis.multiplyScalar(sss);
      ret.set(t, axis);
      return ret;
    };
    exports.Object3D = Object3D;
    exports.Matrix2 = Matrix2;
    exports.Matrix4 = Matrix4;
    exports.Camera = Camera;
    exports.Renderer = Renderer;
    exports.Texture = Texture;
    exports.Triangle = Triangle;
    exports.Scene = Scene;
    exports.Line = Line;
    exports.Plate = Plate;
    exports.Cube = Cube;
    exports.Face = Face;
    exports.Texture = Texture;
    exports.Vector3 = Vector3;
    exports.Color = Color;
    exports.Quaternion = Quaternion;
    exports.AmbientLight = AmbientLight;
    return exports.DirectionalLight = DirectionalLight;
  })(window, window.document, window.S3D || (window.S3D = {}));

  (function(win, doc, exports) {
    var AmbientLight, Camera, Color, Cube, DEG_TO_RAD, DirectionalLight, Face, Line, MOUSE_DOWN, MOUSE_MOVE, MOUSE_UP, Matrix4, Object3D, PI, Particle, Plate, Renderer, Scene, Texture, Triangle, Vector3, base, camera, cos, dragging, getVideo, init, isTouch, logoImage, photoImage, prevX, prevY, renderer, rotX, rotY, scene, sin, startZoom, tan, textureImage, _ref;
    tan = Math.tan, cos = Math.cos, sin = Math.sin, PI = Math.PI;
    _ref = window.S3D, Object3D = _ref.Object3D, Line = _ref.Line, Color = _ref.Color, AmbientLight = _ref.AmbientLight, DirectionalLight = _ref.DirectionalLight, Plate = _ref.Plate, Face = _ref.Face, Cube = _ref.Cube, Texture = _ref.Texture, Triangle = _ref.Triangle, Matrix4 = _ref.Matrix4, Camera = _ref.Camera, Renderer = _ref.Renderer, Scene = _ref.Scene, Vector3 = _ref.Vector3, Particle = _ref.Particle;
    DEG_TO_RAD = PI / 180;
    isTouch = 'ontouchstart' in window;
    MOUSE_DOWN = isTouch ? 'touchstart' : 'mousedown';
    MOUSE_MOVE = isTouch ? 'touchmove' : 'mousemove';
    MOUSE_UP = isTouch ? 'touchend' : 'mouseup';
    textureImage = null;
    logoImage = null;
    photoImage = null;
    rotX = 0;
    rotY = 0;
    renderer = null;
    camera = null;
    scene = null;
    getVideo = function() {
      var video;
      video = doc.getElementById('video');
      video.autoplay = true;
      video.loop = true;
      return video;
    };
    init = function() {
      var aspect, cnt, create, ctx, cv, fov, h, img, logo, photo, video, w;
      video = getVideo();
      cv = doc.getElementById('canvas');
      ctx = cv.getContext('2d');
      w = cv.width = win.innerWidth;
      h = cv.height = win.innerHeight;
      fov = 60;
      aspect = w / h;
      cnt = 3;
      img = new Image();
      logo = new Image();
      photo = new Image();
      img.onload = function() {
        textureImage = img;
        return --cnt || create();
      };
      logo.onload = function() {
        logoImage = logo;
        return --cnt || create();
      };
      photo.onload = function() {
        photoImage = photo;
        return --cnt || create();
      };
      photo.src = '../assets/yrAVl.jpg';
      logo.src = '../assets/z129U.png';
      img.src = '../assets/kMJJS.png';
      camera = new Camera(40, aspect, 0.1, 10000);
      camera.position.x = 10;
      camera.position.y = 50;
      camera.position.z = 200;
      camera.lookAt(new Vector3(0, 0, 0));
      scene = new Scene;
      renderer = new Renderer(cv, '#111');
      return create = function() {
        var ambLight, angle, container, cube1, cube2, cube3, dirLight, i, line, line1, line2, line3, materials1, materials2, plate1, plate2, size, x, z, _i, _j, _loop, _ref1, _ref2;
        materials1 = [new Texture(photoImage, [0, 0, 0, 1, 1, 0]), new Texture(photoImage, [0, 1, 1, 1, 1, 0]), new Texture(photoImage, [0, 0, 0, 1, 1, 0]), new Texture(photoImage, [0, 1, 1, 1, 1, 0]), new Texture(photoImage, [0, 0, 0, 1, 1, 0]), new Texture(photoImage, [0, 1, 1, 1, 1, 0]), new Texture(photoImage, [0, 0, 0, 1, 1, 0]), new Texture(photoImage, [0, 1, 1, 1, 1, 0]), new Texture(photoImage, [0, 0, 0, 1, 1, 0]), new Texture(photoImage, [0, 1, 1, 1, 1, 0]), new Texture(photoImage, [0, 0, 0, 1, 1, 0]), new Texture(photoImage, [0, 1, 1, 1, 1, 0])];
        materials2 = [new Texture(video, [0, 0, 0, 1, 1, 0]), new Texture(video, [0, 1, 1, 1, 1, 0]), new Texture(video, [0, 0, 0, 1, 1, 0]), new Texture(video, [0, 1, 1, 1, 1, 0]), new Texture(video, [0, 0, 0, 1, 1, 0]), new Texture(video, [0, 1, 1, 1, 1, 0]), new Texture(video, [0, 0, 0, 1, 1, 0]), new Texture(video, [0, 1, 1, 1, 1, 0]), new Texture(video, [0, 0, 0, 1, 1, 0]), new Texture(video, [0, 1, 1, 1, 1, 0]), new Texture(video, [0, 0, 0, 1, 1, 0]), new Texture(video, [0, 1, 1, 1, 1, 0])];
        cube1 = new Cube(50, 20, 20, 1, 1, 1, materials2);
        cube1.position.z = -50;
        cube1.rotation.z = 30;
        cube2 = new Cube(20, 20, 20, 1, 1, 1, materials1);
        cube2.position.z = -150;
        cube2.position.x = 50;
        cube3 = new Cube(20, 20, 20, 1, 1, 1, materials1);
        cube3.position.z = -350;
        cube3.position.x = 50;
        cube3.position.y = 80;
        plate1 = new Plate(50, 50, new Texture(textureImage, [0.0, 0.5, 0.0, 1.0, 0.5, 0.5]), new Texture(textureImage, [0.0, 1.0, 0.5, 1.0, 0.5, 0.5]));
        plate1.position.x = -50;
        plate1.position.z = -300;
        plate2 = new Plate(50, 50, new Texture(video, [0, 0, 0, 1, 1, 0]), new Texture(video, [0, 1, 1, 1, 1, 0]));
        plate2.position.y = -100;
        plate2.position.z = -500;
        line1 = new Line(0, 0, -200, 0, 0, 200, new Color(255, 0, 0, 0.3));
        line2 = new Line(-200, 0, 0, 200, 0, 0, new Color(0, 255, 0, 0.3));
        line3 = new Line(0, 200, 0, 0, -200, 0, new Color(0, 0, 255, 0.3));
        size = 300;
        container = new Object3D;
        container.position.x = -(size * 0.5);
        container.position.z = -(size * 0.5);
        for (i = _i = 0, _ref1 = size / 10; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
          z = i * 10;
          line = new Line(0, 0, z, size, 0, z, new Color(255, 255, 255, 0.3));
          container.add(line);
        }
        for (i = _j = 0, _ref2 = size / 10; 0 <= _ref2 ? _j <= _ref2 : _j >= _ref2; i = 0 <= _ref2 ? ++_j : --_j) {
          x = i * 10;
          line = new Line(x, 0, 0, x, 0, size, new Color(255, 255, 255, 0.3));
          container.add(line);
        }
        ambLight = new AmbientLight(0.1);
        dirLight = new DirectionalLight(0.8, (new Vector3(-1, 1, 1)).normalize());
        scene.add(ambLight);
        scene.add(dirLight);
        scene.add(plate1);
        scene.add(plate2);
        scene.add(container);
        scene.add(cube1);
        scene.add(cube2);
        scene.add(cube3);
        scene.add(line1);
        scene.add(line2);
        scene.add(line3);
        angle = 0;
        return (_loop = function() {
          angle = ++angle % 360;
          plate1.rotation.z = angle;
          plate2.rotation.x = angle * 3;
          cube1.rotation.z = angle;
          cube2.rotation.x = angle * 2;
          cube3.rotation.x = angle * 3;
          cube3.rotation.y = angle * 3;
          cube3.rotation.z = angle * 3;
          renderer.render(scene, camera);
          return setTimeout(_loop, 32);
        })();
      };
    };
    dragging = false;
    prevX = 0;
    prevY = 0;
    win.addEventListener('mousewheel', function(e) {
      camera.position.z += e.wheelDelta / 100;
      renderer.render(scene, camera);
      return e.preventDefault();
    }, false);
    base = 100;
    startZoom = 0;
    document.addEventListener('gesturechange', function(e) {
      var num;
      num = e.scale * base - base;
      camera.position.z = startZoom - num;
      renderer.render(scene, camera);
      return e.preventDefault();
    }, false);
    document.addEventListener('gesturestart', function() {
      return startZoom = camera.position.z;
    }, false);
    doc.addEventListener('touchstart', function(e) {
      return e.preventDefault();
    }, false);
    doc.addEventListener(MOUSE_DOWN, function(e) {
      dragging = true;
      prevX = isTouch ? e.touches[0].pageX : e.pageX;
      return prevY = isTouch ? e.touches[0].pageY : e.pageY;
    }, false);
    doc.addEventListener(MOUSE_MOVE, function(e) {
      var pageX, pageY;
      if (dragging === false) {
        return;
      }
      pageX = isTouch ? e.touches[0].pageX : e.pageX;
      pageY = isTouch ? e.touches[0].pageY : e.pageY;
      rotY += (prevX - pageX) / 100;
      rotX += (prevY - pageY) / 100;
      camera.setWorld(Matrix4.multiply((new Matrix4()).rotationY(rotY), (new Matrix4()).rotationX(rotX)));
      prevX = pageX;
      prevY = pageY;
      return renderer.render(scene, camera);
    }, false);
    doc.addEventListener(MOUSE_UP, function(e) {
      return dragging = false;
    }, false);
    return doc.addEventListener('DOMContentLoaded', init, false);
  })(window, window.document, window);

}).call(this);

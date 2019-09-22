(function() {
  var Ball, balls, ctx, gravity, last, main, update;

  ctx = null;

  balls = [];

  gravity = {
    x: 0,
    y: 0
  };

  last = 0;

  Ball = (function() {

    function Ball(x, y) {
      this.x = x;
      this.y = y;
      this.vx = this.vy = 0;
      this.size = 10;
    }

    Ball.prototype.move = function(t) {
      var dt, height, px, py, reflect, size, width, _ref;
      dt = t * 0.1;
      _ref = ctx.canvas, width = _ref.width, height = _ref.height;
      size = this.size;
      this.vx += gravity.x * dt;
      this.vy += gravity.y * dt;
      px = this.x + this.vx;
      py = this.y + this.vy;
      if (px < size || width - size < px) {
        this.vx *= -0.7;
        reflect = Math.abs(this.vx);
      }
      if (py < this.size || height - size < py) {
        this.vy *= -0.7;
        reflect = Math.abs(this.vy);
      }
      this.x += this.vx;
      this.y += this.vy;
      return reflect || 0;
    };

    Ball.prototype.render = function() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      return ctx.fill();
    };

    return Ball;

  })();

  update = function() {
    var ball, height, reflect, t, width, _i, _j, _len, _len1, _ref;
    t = Date.now() - last;
    last += t;
    if (t > 1000) {
      t = 0;
    }
    reflect = 0;
    for (_i = 0, _len = balls.length; _i < _len; _i++) {
      ball = balls[_i];
      reflect += ball.move(t);
    }
    _ref = ctx.canvas, width = _ref.width, height = _ref.height;
    ctx.clearRect(0, 0, width, height);
    for (_j = 0, _len1 = balls.length; _j < _len1; _j++) {
      ball = balls[_j];
      ball.render();
    }
    if (reflect > 7) {
      if (typeof navigator.vibrate === "function") {
        navigator.vibrate(Math.min(60, reflect));
      }
    }
    return requestAnimationFrame(update);
  };

  main = function() {
    var canv;
    canv = document.createElement('canvas');
    canv.width = window.innerWidth;
    canv.height = window.innerHeight;
    document.body.appendChild(canv);
    ctx = canv.getContext('2d');
    ctx.fillStyle = 'black';
    window.addEventListener('deviceorientation', function(_arg) {
      var beta, gamma;
      beta = _arg.beta, gamma = _arg.gamma;
      gravity.y = Math.sin(beta * Math.PI / 180);
      return gravity.x = Math.sin(gamma * Math.PI / 180);
    }, false);
    canv.addEventListener('touchstart', function(e) {
      var clientX, clientY, _ref;
      e.preventDefault();
      _ref = e.changedTouches[0], clientX = _ref.clientX, clientY = _ref.clientY;
      return balls.push(new Ball(clientX, clientY));
    }, false);
    balls.push(new Ball(canv.width / 2, canv.height / 2));
    last = Date.now();
    return update();
  };

  main();

}).call(this);

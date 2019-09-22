(function() {
  var $, code, main;

  code = function() {
    var fx, fy, i, points, shapeInside, updatePoints, x, y, _i, _len, _ref, _results, _step;
    points = [50, 50, 200, 400, 400, 200];
    shapeInside = (new Path).attr('strokeWidth', 3).stroke('black').fill('rgba(100, 150, 255, 0.2)').addTo(stage);
    updatePoints = function() {
      shapeInside.points(points).closePath();
      return stage.sendMessage('update', points);
    };
    updatePoints();
    _ref = 0, fx = _ref[0], fy = _ref[1];
    _results = [];
    for (i = _i = 0, _len = points.length, _step = 2; _i < _len; i = _i += _step) {
      x = points[i];
      y = points[i + 1];
      _results.push((function(i) {
        return (new Circle(x, y, 10)).attr('strokeWidth', 3).stroke('rgb(150, 30, 30)').fill('rgba(150, 30, 30, 0.2)').addTo(stage).on('multi:pointerdown', function(e) {
          var _ref1;
          return _ref1 = [this.attr('x'), this.attr('y')], fx = _ref1[0], fy = _ref1[1], _ref1;
        }).on('multi:drag', function(e) {
          this.attr({
            x: points[i] = fx + e.diffX,
            y: points[i + 1] = fy + e.diffY
          });
          return updatePoints();
        }).emit('multi:pointerdown');
      })(i));
    }
    return _results;
  };

  $ = function(id) {
    return document.getElementById(id);
  };

  main = function() {
    var com, text;
    text = $('textfield');
    com = bonsai.run($('field'), {
      width: innerWidth,
      height: innerHeight,
      code: code
    });
    return com.on('load', function() {
      return com.on('message:update', function(p) {
        var i, x;
        return text.style.WebkitShapeInside = "polygon(" + ((function() {
          var _i, _len, _results, _step;
          _results = [];
          for (i = _i = 0, _len = p.length, _step = 2; _i < _len; i = _i += _step) {
            x = p[i];
            _results.push("" + x + "px " + p[i + 1] + "px");
          }
          return _results;
        })()).join(',') + ")";
      });
    });
  };

  main();

}).call(this);

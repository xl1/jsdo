(function() {
  var Controller, FugaController, HogeController, PiyoController, app,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  app = angular.module('myModule', []);

  app.controller('HogeController', HogeController = (function() {

    function HogeController($window) {
      this.$window = $window;
    }

    HogeController.prototype.text = 'Lorem ipsum';

    HogeController.prototype.say = function() {
      return this.$window.alert(this.text);
    };

    return HogeController;

  })());

  app.controller('FugaController', FugaController = (function() {

    function FugaController($scope, $window) {
      $scope.text = 'Lorem ipsum';
      $scope.say = function() {
        return $window.alert($scope.text);
      };
    }

    return FugaController;

  })());

  Controller = (function() {

    function Controller() {}

    Controller.getController = function() {
      var required,
        _this = this;
      required = angular.injector().annotate(this);
      required.unshift('$scope');
      required.push(function() {
        var $scope, args, key, value, _ref;
        $scope = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        _ref = new _this();
        for (key in _ref) {
          value = _ref[key];
          if (typeof value === 'function') {
            $scope[key] = value.bind($scope);
          } else {
            $scope[key] = value;
          }
        }
        return _this.apply($scope, args);
      });
      return required;
    };

    return Controller;

  })();

  PiyoController = (function(_super) {

    __extends(PiyoController, _super);

    function PiyoController($window) {
      this.$window = $window;
    }

    PiyoController.prototype.text = 'Lorem ipsum';

    PiyoController.prototype.say = function() {
      return this.$window.alert(this.text);
    };

    return PiyoController;

  })(Controller);

  app.controller('piyo', PiyoController.getController());

}).call(this);

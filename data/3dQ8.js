(function() {
  var $, SoundHandler, main, parseHash;

  SoundHandler = (function() {
    var toFreq;

    toFreq = function(x) {
      return 440 * Math.pow(2, x / 12);
    };

    function SoundHandler(lang) {
      var _this = this;
      this.lang = lang;
      this.queue = [];
      this.sound = T('osc', new Float32Array(this.lang.bs.length), 440);
      this.adsr = T('adsr', 150, 500, 500);
      this.adsr.onD = function() {
        return _this.dequeue();
      };
      T('*', this.sound, this.adsr).play();
    }

    SoundHandler.prototype.dequeue = function() {
      var param;
      if (param = this.queue.shift()) {
        this.sound.set('wave', param.array);
        this.sound.set('freq', param.freq);
        return this.adsr.bang();
      }
    };

    SoundHandler.prototype.play = function() {
      var stat;
      this.queue.push({
        array: new Float32Array(this.lang.bs.toNumArray().map(function(x) {
          return x / 3;
        })),
        freq: toFreq((this.lang.acc - 1) % 128)
      });
      stat = this.adsr.status;
      if ((stat === 'off') || (stat === 'd')) {
        return this.dequeue();
      }
    };

    return SoundHandler;

  })();

  parseHash = function() {
    return location.hash.slice(1).split('&').reduce(function(q, cur) {
      var idx;
      idx = cur.indexOf('=');
      if (idx < 0) {
        q[cur] = void 0;
      } else {
        q[cur.slice(0, idx)] = decodeURIComponent(cur.slice(idx + 1));
      }
      return q;
    }, {});
  };

  $ = function(id) {
    return document.getElementById(id);
  };

  main = function() {
    var lang, len, query, soundHandler;
    query = parseHash();
    if (!(len = +query['l'])) {
      len = +prompt('length of bars', 24) || 24;
      location.hash += "l=" + len;
    }
    lang = new BarsLang(len);
    soundHandler = new SoundHandler(lang);
    return document.addEventListener('DOMContentLoaded', function() {
      var $canvas, $input, $output, $status, run;
      $output = $('output');
      $input = $('input');
      $status = $('status');
      $canvas = $('canvas');
      lang.updateRule('|', function() {
        $canvas.value += "|" + this.bs + "|\n";
        soundHandler.play();
        return this.bs.next();
      });
      run = function(commands) {
        $output.value = lang.run(commands) + '\n';
        return $status.value = lang.getState();
      };
      $input.addEventListener('keypress', function() {
        return setTimeout(function() {
          return run($input.value.slice(-1));
        }, 0);
      }, false);
      return run($input.value = query['c'] || '');
    }, false);
  };

  main();

}).call(this);

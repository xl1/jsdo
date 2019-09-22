(function() {
  var Bars,
    __slice = [].slice;

  Number.prototype.mod = function(modulo) {
    var num;
    num = +this;
    while (num <= 0) {
      num += modulo;
    }
    return num % modulo;
  };

  String.prototype.times = function(count) {
    return (new Array(count + 1)).join(this);
  };

  Bars = (function() {
    var chars, suc;

    chars = ' iTI';

    suc = function(l, c, r) {
      return (1 & (l + r + (c >> 1))) | (2 & (c << 1));
    };

    function Bars(str) {
      this._arr = str.split('').map(function(s) {
        return chars.indexOf(s);
      });
      this.length = this._arr.length;
    }

    Bars.prototype.next = function() {
      var after, before, current, i, len, newarr, _i, _len, _ref, _ref1;
      len = this.length;
      newarr = [];
      _ref = this._arr;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        current = _ref[i];
        before = this._arr[(i - 1).mod(len)];
        after = this._arr[(i + 1).mod(len)];
        newarr[i] = suc(before, current, after);
      }
      (_ref1 = this._arr).splice.apply(_ref1, [0, Infinity].concat(__slice.call(newarr)));
      return this;
    };

    Bars.prototype.toString = function() {
      return this._arr.map(function(i) {
        return chars[i];
      }).join('');
    };

    Bars.prototype.toNumArray = function() {
      return this._arr.slice(0);
    };

    Bars.prototype.set = function(pos, s) {
      return this._arr[pos] = chars.indexOf(s);
    };

    return Bars;

  })();

  /*
    original python script from http://cp1.nintendo.co.jp/??????/bars_lang.py
  　　オリジナルの Python コードの著作権は任天堂株式会社にあります
  */


  window.BarsLang = (function() {

    function BarsLang(n) {
      this.bs = new Bars(' '.times(n));
      this.pos = 0;
      this.acc = 1;
      this.accx = 1;
      this.output = '';
      this.pc = 0;
      this._customRules = {};
    }

    BarsLang.prototype.reset = function() {
      return this.bs = new Bars(' '.times(this.bs.length));
    };

    BarsLang.prototype.getState = function() {
      return ["|" + this.bs + "|", ' '.times(this.pos + 1) + '^', "acc:  " + this.acc, "accx: " + this.accx].join('\n');
    };

    BarsLang.prototype.updateRule = function(char, func) {
      return this._customRules[char] = func;
    };

    BarsLang.prototype.run = function(commands) {
      var bslen, c, i, m, re, rule, s, t, _i, _ref, _ref1, _ref2, _ref3;
      this.pc = 0;
      bslen = this.bs.length;
      while ((0 <= (_ref3 = this.pc) && _ref3 < commands.length)) {
        c = commands[this.pc];
        if (rule = this._customRules[c]) {
          rule.call(this);
          this.pc++;
          continue;
        }
        switch (c) {
          case '1':
            this.acc = 1;
            break;
          case '/':
            this.acc *= 2;
            break;
          case ')':
            this.pos = (this.pos + this.acc).mod(bslen);
            break;
          case '(':
            this.pos = (this.pos - this.acc).mod(bslen);
            break;
          case 'i':
          case 'T':
          case 'I':
          case ' ':
            for (i = _i = 1, _ref = this.acc; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
              this.bs.set(this.pos, c);
              this.pos = (this.pos + 1).mod(bslen);
            }
            break;
          case ']':
            t = this.bs.toString();
            s = t.slice(this.pos) + t.slice(0, this.pos + 1);
            re = new RegExp('^ *[iT]* ', 'g');
            this.acc = re.exec(s) ? re.lastIndex - 1 : 0;
            break;
          case '[':
            t = this.bs.toString();
            s = t[(this.pos - 1).mod(bslen)] + t.slice(this.pos) + t.slice(0, this.pos);
            re = new RegExp(' [iT]* *$', 'g');
            this.acc = (m = re.exec(s)) ? s.length - m.index - 1 : 0;
            break;
          case 'l':
            _ref1 = [this.accx, this.acc], this.acc = _ref1[0], this.accx = _ref1[1];
            break;
          case 'L':
            _ref2 = [this.accx - this.acc, this.accx + this.acc], this.acc = _ref2[0], this.accx = _ref2[1];
            break;
          case '{':
            this.pc -= this.acc;
            break;
          case '}':
            this.pc += this.acc;
            break;
          case '?':
            t = this.bs.toString();
            this.acc *= 'TI i'.indexOf(t[this.pos]) - 2;
            break;
          case '|':
            console.log(this.bs.toString());
            this.bs.next();
            break;
          case '!':
            this.output += String.fromCharCode((this.acc + 48).mod(128));
        }
        this.pc++;
      }
      return this.output;
    };

    return BarsLang;

  })();

}).call(this);

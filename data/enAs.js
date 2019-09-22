(function(){

var _AudioContext = window.AudioContext || window.webkitAudioContext;
if(_AudioContext){
  window.MicroMML = MicroMML;
} else return;

var PI = Math.PI;

/*
0 sin
1 upward saw
2 downward saw
3 triangle
4 rectangle
5 white noise
6 noise
*/
var soundFunc = [
  Math.sin,
  function(p){ return p/PI-1; },
  function(p){ return 1-p/PI; },
  function(p){ p *= 2/PI; return p<1 ? p : p<3 ? 2-p : p-4; },
  function(p){ return p<PI ? 1 : -1; },
  function(p){ return Math.random() * 2 - 1; },
  (function(){
    var pp = 1, c = 5, r = 0.05;
    return function(p){
      if(!p) c = 5;
      if(!c--) r = p<0 ? -p : p;
      return pp = (Math.random() < r ? -pp : pp);
    };
  })()
];
var fadeFunc = [
  function(j){ return j<0.8 ? 1 : (1-j)/(1-0.8); },
  function(j){ return 1-j; },
  function(j){ return 1; }
];

var frequency = (function(){
  var k0 = { c: -9, d: -7, e: -5, f: -4, g: -2, a: 0, b: 2 };
  var k1 = { '+': 1, '#': 1, '': 0, '-': -1 };
  return function(h, sign, oct){
    return 13.75 * Math.pow(2, (k0[h] + k1[sign]) / 12 + (oct || 0));
  };
})();

function MicroMML(source, ctx){
  if(!ctx) ctx = new _AudioContext();
  var node = null;
  var compiled = false;
  if(source) compile();
  
  this.set = _set;
  this.toString = _toString;
  this.play = _play;
  this.stop = _stop;
  this.getNode = _getNode;
  
  function compile(){
    if(node) node.disconnect();
  
    var buffer = new Array();
    var trackData = source.split(';');
    var numTracks = trackData.length;
    
    for(var track = 0; track < numTracks; track++){
      var cfg = {
        pos: 0,
        oct: 5,
        sound: soundFunc[0],
        fade: fadeFunc[0],
        tempo: 120,
        volume: 16,
        sndLen: 4,
        loopStart: [],
        loop: [],
        sampleRate: 22050
      };
      
      var re = new RegExp(/([a-z<>\[\]()@])([-+#]?)(\d*)/g);
      var s;
      while(s = re.exec(trackData[track])){
        var val = s[3] |0;
        var freq, len;
        switch(s[1]){
          case 'c': case 'd': case 'e': case 'f': case 'g': case 'a': case 'b':
            freq = frequency(s[1], s[2], cfg.oct);
            len = val || cfg.sndLen;
            len = cfg.sampleRate/* sample/sec */
                * 60/* sec/min */
                * 4/* 四分音符/小節 */
                / cfg.tempo/* 四分音符/min */
                / len/* /小節 */;
            for(var i = 0; i < len; i++){
              var idx = cfg.pos + i |0;
              var p = 2 * PI * (freq * i / cfg.sampleRate % 1);
              if(buffer.length <= idx) buffer[idx] = 0;
              buffer[idx] +=
                cfg.volume / 16 * cfg.sound(p) * cfg.fade(i / len) / numTracks;
            }
            cfg.pos += len;
            break;
          case 'r':
            len = val || cfg.sndLen;
            cfg.pos += cfg.sampleRate * 60 * 4 / cfg.tempo / len;
            break;
          case '<': cfg.oct +=  val || 1; break;
          case '>': cfg.oct -=  val || 1; break;
          case '[':
            cfg.loopStart.push(re.lastIndex);
            cfg.loop.push(-1);
            break;
          case ']':
            var loop = cfg.loop.pop();
            if(loop === -1) loop = s[3] ? val : 2; // first appearance of ]
            if(--loop === 0){
              cfg.loopStart.pop();
            } else {
              cfg.loop.push(loop);
              re.lastIndex = cfg.loopStart[cfg.loopStart.length - 1];
            }
            break;
          case '(': cfg.volume += val || 1; break;
          case ')': cfg.volume -= val || 1; break;
          case 'l': if(val) cfg.sndLen = val; break;
          case 't': if(val) cfg.tempo = val; break;
          case 'v': cfg.volume = val; break;
          case 'o': cfg.oct = val; break;
          case '@': cfg.sound = soundFunc[val] || soundFunc[0]; break;
          default: break;
        }
      }
    }
    
    // set buffer
    var channel = 1;
    node = ctx.createBufferSource();
    node.buffer = ctx.createBuffer(channel, buffer.length, cfg.sampleRate);
    node.buffer.getChannelData(0).set(buffer);
    compiled = true;
  }
  
  function _set(newSource){ source = newSource; compile(); }
  function _toString(){ return source; }
  function _play(){
    if(compiled){
      node.connect(ctx.destination);
      node.noteOn(0);
    }
  }
  function _stop(){
    node.disconnect();
  }
  function _getNode(){ return node; }
}

})();
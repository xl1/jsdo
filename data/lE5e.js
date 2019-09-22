var cfg = {
  edge : 0.5,
  sampleRate: 44100,
  bufferSize: 4096
};
var ctx = new (window.AudioContext || window.webkitAudioContext)();
ctx.sampleRate = cfg.sampleRate;
ctx.phase = 0;

var tones = {
  o    : new Tone(ctx, function(){ return 0; }),
  sine : new Tone(ctx, function(p){ return Math.sin(2*Math.PI*p); }),
  tri  : new Tone(ctx, function(p){
    return p < 0.25 ? 4*p : p < 0.75 ? 2-4*p : 4*p-4;
  }),
  saw  : new Tone(ctx, function(p){ return 2*p-1; }),
  rect : new Tone(ctx, function(p){ return p < 0.5 ? 1 : -1; }),
  noise: new Tone(ctx, function(){ return Math.random() * 2 - 1; })
};

var sound;
var updateSound = (function(){
  var tone = tones.sine.synth(tones.sine.double()).x(2);
  var freq = 440;
  return function(x){
    if(typeof x === 'number'){
      freq = x;
    } else if(x instanceof Tone){
      tone = x;
    }
    sound = tone.generate(freq);
  };
})();

// add events
$('trigger').addEventListener('input', function(){
  cfg.edge = this.value -0;
}, false);
$('freq').addEventListener('input', function(){
  updateSound(this.value -0);
}, false);
Array.prototype.forEach.call($('soundButtons').querySelectorAll('button'),
    function(e){
  e.addEventListener('click', function(){
    updateSound(tones[e.innerText]);
  }, false);
});
$('applyButton').addEventListener('click', function(){
  var t;
  try{ t = eval($('txt').value); } catch(e) {}
  if(t instanceof Tone) updateSound(t);
}, false);

updateSound();


// create node
var node = ctx.createJavaScriptNode(cfg.bufferSize, 0, 1);

node.onaudioprocess = (function(cnv){
  var width = cnv.canvas.width;
  var height = cnv.canvas.height;
  cnv.strokeStyle = '#000';
  
  return function(e){
    var data = e.outputBuffer.getChannelData(0);
    cnv.clearRect(0, 0, width, height);
    var drawing = false;
    cnv.beginPath();
    for(var i = 0, j = 0; i < data.length; i++){
      var snd = sound();
      snd = snd > 1 ? 1 : snd < -1 ? -1 : snd;
      data[i] = snd;
      if(data[i-1] < cfg.edge && cfg.edge <= snd) drawing = true; // trigger
      if(drawing && j < width){
        var y = height * (1 - snd) * .5;
        j ? cnv.lineTo(j, y) : cnv.moveTo(j, y);
        j++;
      }
    }
    cnv.stroke();
  };
})(document.getElementsByTagName('canvas')[0].getContext('2d'));

node.connect(ctx.destination);

// --- --- ---

function $(i){ return document.getElementById(i); }

function Tone(ctx, baseFunc){
  var my = this;
  this.func = baseFunc;
  this.generate = _generate;
  this.synth = _synth;
  this.x = _x;
  this.double = _double;
  function _generate(freq, amp){
    if(!freq) freq = 440;
    if(typeof amp === 'undefined') amp = 1;
    return function(){
      ctx.phase = (ctx.phase + freq / ctx.sampleRate) % 1;
      return amp * my.func(ctx.phase);
    };
  }
  function _synth(tone){
    return new Tone(ctx, function(p){
      return (my.func(p) + tone.func(p)) * .5;
    });
  }
  function _x(v){
    return new Tone(ctx, function(p){
      return v * my.func(p);
    });
  }
  function _double(v){
    if(typeof v === 'undefined') v = 2;
    return new Tone(ctx, function(p){
      return my.func(v * p % 1);
    });
  }
}
jsPlumb.bind('ready', function(){
  
if(!window.MusicElementsContext) return;
var ctx = new MusicElementsContext($(document.body));

var elems = [
  // destination
  ctx.addElement(375, 100, 'dest.', 'destination'),
  // sources
  ctx.addElement( 10,  50, 'audio mml', 'audio', {
    mml: 'l16 @1 v16 o5 [ab<ecdfc>b][ga<d>b<cd>ba]fg<c>ab<c>a<c c>b<cddcdf efdecd>b<c> a8<c8>b8a-8;' +
    'l4  @3 v12 o3 [a<c>][g<c>]fa b<e> ba <c>b;' +
    'l16 @6 v3  o3 [cr<<b>>c cr<<b>>c cc<<b>>r cr<<b>>r]4'
  }),
  ctx.addElement( 10, 100, 'audio .mp3', 'audio', {
    url: '../assets/svg_girl_theme.mp3'
  }),
  ctx.addElement( 10, 150, 'audio .ogg', 'audio', {
    url: '../assets/svg_girl_theme.ogg'
  }),
  ctx.addElement( 10, 250, 'sound sine440', 'sound',
    soundForm(440, 100, Math.sin)
  ),
  ctx.addElement( 10, 350, 'sound rect660', 'sound',
    soundForm(660, 100, function(r){ return r<Math.PI ? .7 : -.7; })
  ),
  // effectors
  ctx.addElement(160,  50, 'gain 0.2', 'gain', { gain: 0.2 }),
  ctx.addElement(140, 100, 'lowpass filter', 'filter', { type: 'lowpass' }),
  ctx.addElement(160, 150, 'highpass filter', 'filter', {
    type: 'highpass',
    frequency: 2000
  }),
  ctx.addElement(140, 200, 'dynamics compressor', 'compressor'),
  ctx.addElement(160, 250, 'panner left', 'panner', { position: [-1, 0, 1] }),
  ctx.addElement(140, 300, 'panner right', 'panner', { position: [1, 0, 1] }),
  ctx.addElement(160, 350, 'delay', 'delay', { delay: 0.1 }),
  // analysers
  ctx.addElement(310,  50, 'freq analyser', 'analyser', { type: 'freq' }),
  ctx.addElement(310, 150, 'wave analyser', 'analyser', { type: 'wave' }),
  // switches
  ctx.addElement(310, 250, 'switch', 'switch'),
  ctx.addElement(310, 300, 'switch', 'switch'),
  ctx.addElement(310, 350, 'switch', 'switch')
];
elems[2].attach(elems[7]);
elems[7].attach(elems[13]);
elems[13].attach(elems[0]);

function soundForm(freq, len, func){
  var rate = 2 * Math.PI / len;
  return {
    dataLength: len,
    sampleRate: freq * len,
    dataFunc: [ function(i){ return func(rate * i); } ]
  };
}

});
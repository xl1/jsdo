(function(){

var _AudioContext = window.AudioContext || window.webkitAudioContext;
if(_AudioContext){
  window.MusicElementsContext = MusicElementsContext;
} else return;


var targetColor = '#c44';
var sourceColor = '#4c4';
var conStyle = { lineWidth: 3, strokeStyle: '#ccc' };

var targetPoint = {
  endpoint: 'Dot',
  paintStyle: { fillStyle: targetColor, radius: 10 },
  anchor: 'LeftMiddle',
  isTarget: true,
  isSource: true,
  connectorStyle: conStyle,
  maxConnections: -1
};
var sourcePoint = {
  endpoint: 'Dot',
  paintStyle: { fillStyle: sourceColor, radius: 10 },
  anchor: 'RightMiddle',
  isTarget: true,
  isSource: true,
  connectorStyle: conStyle,
  maxConnections: -1
};

(function(){
  jsPlumb.bind("jsPlumbConnection", connectME);
  jsPlumb.bind("jsPlumbConnectionDetached", disconnectME);
  
  function connectME(e){
    var p = endpointPair(e.sourceEndpoint, e.targetEndpoint);
    if(p){
      $me(p.source).connect($me(p.target));
    } else {
      jsPlumb.detach(e.connection);
    }
  }
  function disconnectME(e){
    var p = endpointPair(e.sourceEndpoint, e.targetEndpoint);
    if(!p) return;
    $me(p.source).disconnect();
    p.source.connections.forEach(function(c){
      var pp = endpointPair(c.endpoints);
      $me(pp.source).connect($me(pp.target));
    });
  }
  function $me(endpoint){
    return endpoint.getElement()[0].parentMusicElement;
  }
  function endpointPair(source, target){
    if(!target){
      target = source[1]; source = source[0];
    }
    // よくない
    if(source.paintStyle.fillStyle === targetColor){
      if(target.paintStyle.fillStyle === sourceColor){
        return { source: target, target: source };
      } else {
        return null;
      }
    } else if(target.paintStyle.fillStyle === sourceColor){
      return null;
    }
    return { source: source, target: target };
  }
})();


// --- --- ---


function MusicElementsContext(parent){
  var canv = $('<canvas>')
    .attr({
      width: 1024,
      height: 256
    })
    .css({
      width: '100%',
      height: '100%',
      position: 'absolute',
      left: 0,
      top: 0,
      'z-index': -1
    })
    .appendTo(parent)[0];
  var cc = canv.getContext('2d');
  cc.strokeStyle = '#888';
  
  var ctx = new _AudioContext();
  this.parent = _parent;
  this.addElement = _addElement;
  
  function _parent(){ return parent; }
  function _addElement(x, y, text, type, opt){
    return new MusicElement(x, y, text, type, opt);
  }
  
  function MusicElement(x, y, text, type, opt){
    var node = null, rootNode = null;
    // (input) -> node -> (output)
    // (input) -> rootNode -> ... -> node -> (output)
    
    // create DOM element
    var elem = $('<div>')
      .addClass('musicElement')
      .text(text)
      .offset({ left: x, top: y })
      .appendTo(parent);
    elem[0].parentMusicElement = this;
    jsPlumb.draggable(elem);
      
    // add jsPlumb endpoints
    var param = {
   /* typename    : [in, out, func] */ 
      destination : [1, 0, createDestination],
      audio       : [0, 1, createAudio],
      sound       : [0, 1, createSound],
      analyser    : [1, 1, createAnalyser],
      gain        : [1, 1, createGain],
      filter      : [1, 1, createFilter],
      delay       : [1, 1, createDelay],
      panner      : [1, 1, createPanner],
//      convolver   : [1, 1, createConvolver], // どうやって使うのかわからない
      compressor  : [1, 1, createCompressor],
      'switch'    : [1, 1, createSwitch]
    }[type];
    if(!param) return;
    if(param[0]) this.targetPoint = jsPlumb.addEndpoint(elem, targetPoint);
    if(param[1]) this.sourcePoint = jsPlumb.addEndpoint(elem, sourcePoint);
    param[2]();
    
    // methods
    this.getNode = _getNode;
    //this.getElement = function _getElement(){ return elem; };
    this.attach = _attach;
    this.detach = _detach;
    this.connect = _connect;
    this.disconnect = _disconnect;
    this.remove = _remove;
    
    
    function _getNode(){ return rootNode || node; }
    function _attach(dest){
      jsPlumb.connect(
        { source: this.sourcePoint, target: dest.targetPoint }
      );
    }
    function _detach(dest){
      jsPlumb.detach(
        { source: this.sourcePoint, target: dest.targetPoint }
      );
    }
    function _connect(dest){ node.connect(dest.getNode()); }
    function _disconnect(){ node.disconnect(); }
    function _remove(){ elem.remove(); }

    
    function createDestination(){
      node = ctx.destination;
    }
    function createAudio(){
      if(window.MicroMML && 'mml' in opt){
        node = new MicroMML(opt.mml, ctx).getNode();
        node.looping = ('looping' in opt) ? opt.looping : true;
        setTimeout(function(){ node.noteOn(0); }, 1000);
        return;
      }
      node = ctx.createBufferSource();
      node.looping = ('looping' in opt) ? opt.looping : true;
      
      var xhr = new XMLHttpRequest();
      xhr.open('GET', opt.url, true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = function(){
        node.buffer = ctx.createBuffer(xhr.response, false);
        node.noteOn(0);
      };
      xhr.send();
    }
    function createSound(){
      var channel = opt.channel;
      var len = opt.dataLength;
      var sampleRate = opt.sampleRate || 44100;
      
      node = ctx.createBufferSource();
      node.looping = ('looping' in opt) ? opt.looping : true;
      
      if('data' in opt){
        // opt.data[] is used
        channel = channel || opt.data.length;
        len = len || opt.data[0].length;
        node.buffer = ctx.createBuffer(channel, len, sampleRate);
        
        for(var c = 0; c < opt.data.length; c++){
          node.buffer.getChannelData(c).set(opt.data[c]);
        }
      } else if('dataFunc' in opt) {
        // create data from opt.dataFunc[]
        channel = channel || opt.dataFunc.length;
        node.buffer = ctx.createBuffer(channel, len, sampleRate);
        
        for(var c = 0; c < channel; c++){
          var data = node.buffer.getChannelData(c);
          for(var i = 0; i < data.length; i++){
            data[i] = opt.dataFunc[c](i);
          }
        }
      } else return;
      node.noteOn(0);
    }
    function createAnalyser(){
      rootNode = ctx.createAnalyser();
      node = ctx.createJavaScriptNode(2048, 1, 1);
      node.onaudioprocess = function(e){
        var input = e.inputBuffer.getChannelData(0);
        //var inputR = e.inputBuffer.getChannelData(1);
        e.outputBuffer.getChannelData(0).set(input);
        //e.outputBuffer.getChannelData(1).set(inputR);
        
        var data = new Uint8Array(rootNode.frequencyBinCount);
        if(opt.type === 'freq'){
          rootNode.getByteFrequencyData(data);
        } else if(opt.type === 'wave'){
          rootNode.getByteTimeDomainData(data);
        }
        
        // render data
        cc.clearRect(0, 0, canv.width, canv.height);
        cc.beginPath();
        cc.moveTo(0, 256 - data[0]);
        for(var i = 1; i < data.length; i++) cc.lineTo(i, 256 - data[i]);
        cc.stroke();
      };
      rootNode.connect(node);
    }
    function createGain(){
      node = ctx.createGainNode();
      node.gain.value = opt.gain;
    }
    function createFilter(){
      node = ctx.createBiquadFilter();
      node.type = node[(opt.type || 'ALLPASS').toUpperCase()];
      if('frequency' in opt) node.frequency.value = opt.frequency;
      if('Q' in opt)         node.Q.value = opt.Q;
      if('gain' in opt)      node.gain.value = opt.gain;
      
      rootNode = ctx.createJavaScriptNode(2048, 1, 1); // dummy
      rootNode.onaudioprocess = function(e){
        var inputL = e.inputBuffer.getChannelData(0);
        //var inputR = e.inputBuffer.getChannelData(1);
        e.outputBuffer.getChannelData(0).set(inputL);
        //e.outputBuffer.getChannelData(1).set(inputR);
      };
      rootNode.connect(node);
    }
    function createDelay(){
      node = ctx.createDelayNode();
      node.delayTime.value = opt.delay;
    }
    function createPanner(){
      node = ctx.createPanner();
      if('ref' in opt) node.refDistance = opt.ref;
      if('max' in opt) node.maxDistance = opt.max;
      ['position', 'orientation', 'velocity'].forEach(function(attr){
        if(attr in opt)
          node['set' + attr[0].toUpperCase() + attr.substr(1)]
            .apply(node, opt[attr]);
      });
    }
    function createCompressor(){
      // 何をするためのものかよくわからない
      node = ctx.createDynamicsCompressor();
    }
    function createSwitch(){
      node = ctx.createGainNode();
      rootNode = ctx.createGainNode();
      var connected = false;
      elem.dblclick(function(){
        if(connected = !connected){
          rootNode.connect(node);
        } else {
          rootNode.disconnect();
        }
      }); 
    }
  }
}

})();
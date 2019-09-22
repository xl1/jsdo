(function(){

var PI2 = Math.PI * 2,
    NUM_POINTS = 400;

var gl = new MicroGL();
if(!gl.enabled) return alert('sorry webgl not supported');
gl.program($('vshader').textContent, $('fshader').textContent);

var video = document.createElement('video'),
    tex,
    points = randArray(NUM_POINTS * 2),
    velocity = randArray(NUM_POINTS * 2),
    userMedia = navigator.getUserMedia || navigator.webkitGetUserMedia,
    setCamera = function(src){
      var url = window.URL || window.webkitURL;
      video.src = url ? url.createObjectURL(src) : src;
    },
    setVideo = function(){
      video.src = '../assets/trailer.webm';
      video.loop = true;
    };
    
if(userMedia){
  try{
    userMedia.call(navigator, { video: true }, setCamera, setVideo);
  } catch(e) {
    userMedia.call(navigator, 'video', setCamera, setVideo);
  }
} else setVideo();

gl.bindVars({ aPosition: createCone() });
video.addEventListener('canplay', init, false);

function init(){
  gl.init(document.body, 465, 465);
  video.play();
  requestAnimationFrame(update);
}

function update(){
  var i = NUM_POINTS,
      px, py;

  gl.clear();

  gl.bindVars({
    uSampler: tex = gl.texture(video, tex)
  });

  for(; i--;){
    px = points[i * 2]     += (velocity[i * 2] - 0.5) / 100;
    py = points[i * 2 + 1] += (velocity[i * 2 + 1] - 0.5) / 100;
    gl.bindVars({
      uPoint: [px, py]
    });
    gl.draw('TRIANGLE_FAN');
  }
  requestAnimationFrame(update);
}

function createCone(level){
  var i = level = level || 90,
      res = [0, 0, -1, 1, 0, 0],
      rad;
  for(; i--;){
    rad = i * PI2 / level;
    res.push(Math.cos(rad));
    res.push(Math.sin(rad));
    res.push(0);
  }
  return res;
}

function randArray(num){
  var i = num,
      res = [];
  for(; i--;){
    res[i] = Math.random();
  }
  return res;
}

function $(i){
  return document.getElementById(i);
}

})();
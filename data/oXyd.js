(function(){

var PI2 = Math.PI * 2,
    NUM_POINTS = 200;

var gl = new MicroGL();
if(!gl.enabled) return alert('sorry webgl not supported');
gl.program($('vshader').textContent, $('fshader').textContent);

var points = randArray(NUM_POINTS * 2),
    velocity = randArray(NUM_POINTS * 2),
    colors = randArray(NUM_POINTS * 3);

gl.bindVars({ aPosition: createCone() });

document.addEventListener('DOMContentLoaded', init, false);

function init(){
  gl.init(document.body, 465, 465);
  requestAnimationFrame(update);
}

function update(){
  var i = NUM_POINTS,
      px, py;

  gl.clear();
  
  for(; i--;){
    px = points[i * 2]     += (velocity[i * 2] - 0.5) * 0.01;
    py = points[i * 2 + 1] += (velocity[i * 2 + 1] - 0.5) * 0.01;
    gl.bindVars({
      uPoint: [px, py],
      uColor: colors.slice(i * 3, (i + 1) * 3)
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
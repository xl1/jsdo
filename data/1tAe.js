(function(win, doc){

var width = win.innerWidth,
    height = win.innerHeight,
    size = Math.min(width, height),
    canv = doc.getElementById('canv'),
    ctx = canv.getContext('2d'),
    compass = 0;

win.addEventListener('deviceorientation', getCompass, false);
canv.width = width;
canv.height = height;
render();

function render(){
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.translate(width * 0.5, height * 0.5);
  ctx.rotate(compass);
  drawPath('red', [
     0.0, -0.4,
    -0.1,  0.0,
     0.1,  0.0
  ]);
  drawPath('silver', [
     0.0,  0.4,
    -0.1,  0.0,
     0.1,  0.0
  ]);
  ctx.restore();
  
  requestAnimationFrame(render);
}
function drawPath(style, nodes){
  ctx.fillStyle = style;
  ctx.beginPath();
  ctx.moveTo(size * nodes[0], size * nodes[1]);
  for(var i = 2, l = nodes.length; i < l; i += 2){
    ctx.lineTo(size * nodes[i], size * nodes[i + 1]);
  }
  ctx.closePath();
  ctx.fill();
}
function getCompass(e){
  compass = e.alpha * Math.PI / 180;
}

})(window, document);
window.requestAnimationFrame = (
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(func){
    return window.setTimeout(func, 1000/60);
  }
);
var ctx = document.getElementById('world').getContext('2d');
var cnt = document.getElementById('counter');
var i = 0;
(function(){
  ctx.fillStyle = '#' + ('000000' + (Math.random()*0x1000000 |0).toString(16)).slice(-6);
  ctx.fillRect(Math.random()*300, Math.random()*250, 100, 100);
  cnt.innerText = i++;
  requestAnimationFrame(arguments.callee);
})();
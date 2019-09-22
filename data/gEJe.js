var LOOP_MAX = 100000;

// wait for loading an image
window.addEventListener('load', function(){
  var res = [],
      i = 0,
      l;
  
  res.push('canvas size: 128 x 128 = 16384 pixels');
  res.push('hardware accelerated drawImage(): ' + test(128, 128) + 'ms');
  res.push('');
  
  res.push('canvas size: 129 x 127 = 16383 pixels');
  res.push('software rendered drawImage(): ' + test(129, 127) + 'ms');
  
  for(l = res.length; i < l; i++){
    document.body.innerHTML += ('<div>' + res[i] + '&nbsp;</div>');
  }
}, false);
  
function test(width, height){
  var img = document.getElementById('image'),
      canv = document.createElement('canvas'),
      ctx,
      result,
      t,
      i = LOOP_MAX;
  
  canv.setAttribute('width', width);
  canv.setAttribute('height', height);
  document.body.appendChild(canv);
  ctx = canv.getContext('2d');
  
  t = Date.now();
  for(; i--;){
    ctx.drawImage(img, 0, 0);
  }
  result = Date.now() - t;
  
  document.body.removeChild(canv);
  return result;
}
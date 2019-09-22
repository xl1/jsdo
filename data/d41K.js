var inputx = document.getElementById('inputx'),
    inputy = document.getElementById('inputy'),
    box = new Box();

inputx.addEventListener('input', function(){
  box.x = this.value;
}, false);
inputy.addEventListener('input', function(){
  box.y = this.value;
}, false);

function Box(parent){
  var x = 0, y = 0, elem;
  elem = document.createElement('div');
  elem.className = 'box';
  (parent || document.body).appendChild(elem);
  
  Object.defineProperty(this, 'x', {
    get: function(){ return x; },
    set: function(v){
      v = v - 0;
      if(isNaN(v)) return;
      x = v;
      elem.style.left = x + 'px';
    }
  });
  this.x = x;
  
  Object.defineProperty(this, 'y', {
    get: function(){ return y; },
    set: function(v){
      v = v - 0;
      if(isNaN(v)) return;
      y = v;
      elem.style.top = y + 'px';
    }
  });
  this.y = y;
}
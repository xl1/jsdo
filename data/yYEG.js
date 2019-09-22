// forked from peko's "microgl test" http://jsdo.it/peko/jt3q
var gl = new MicroGL(), startT = 0;

function $text(id){
  return document.getElementById(id).textContent;
}

function main(){
  // append <canvas> element to <body>
  gl.init(document.body, 256, 256);
  // compile shaders and link the program
  gl.program($text('vshader'), $text('fshader'));
  // bind variables
  gl.bindVars({
    a_position: [0,0, 0,1, 1,0, 1,1],
    // images will be loaded asynchronously
    // use `gl.texture(img, tex, callback)` to listen img.onload
    //u_sampler: 'test.jpg',
    u_sampler: '../assets/hruW5.jpg',
    // matrices are transposed in shaders
    u_perspective: [
      2, 0, 0, 0,
      0, 2, 0, 0,
      0, 0, 1005/995, 1,
      0, 0, -1000/995, 0
    ]
  });
  startT = Date.now();
  update();
}

function update(){
  var t = (Date.now() - startT) * 0.003;
  // update model-view matrix
  gl.bindVars({
    u_modelView: [
      Math.cos(t), 0, -Math.sin(t), 0,
      0,           1,            0, 0,
      Math.sin(t), 0,  Math.cos(t), 0,
      0, -0.5, 3, 1
    ]
  });
  // then draw!
  gl.clear().draw();
  
  requestAnimationFrame(update);
}

// start
main();
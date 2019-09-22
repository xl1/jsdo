// forked from motomizuki's "three.js　軸回転のテスト" http://jsdo.it/motomizuki/vI5z
var camera, scene, renderer,
    geometry, meterial, mesh,

    shiftF = false,
    rotateState = new THREE.Vector3(),
    KEY = {
      RIGHT: 39,
      UP: 38,
      LEFT: 37,
      DOWN: 40,
      SHIFT: 16
    };

init();

function init(){
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, 1, 1, 10000);
  camera.position.z = 1000;
  scene.add(camera);

  geometry = new THREE.CubeGeometry(200, 200, 200);
  material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

  mesh = new THREE.Mesh(geometry, material);
  // クオータニオンを使うようにする
  // mesh.rotation は無視されるようになる
  mesh.useQuaternion = true;

  scene.add(mesh);

  renderer = new THREE.CanvasRenderer();
  renderer.setSize(465, 465);

  document.body.appendChild(renderer.domElement);

  document.addEventListener('mousedown', clickHandler, false);
  document.addEventListener('keydown', keydownHandler, false);
  document.addEventListener('keyup', keyupHandler, false);

  render();
}

// 描画する
function render(){
  document.getElementById('rotation').innerHTML = [
    'x: ' + rotateState.x,
    'y: ' + rotateState.y,
    'z: ' + rotateState.z
  ].join('<br />');

  renderer.render(scene, camera);
}

// mesh を回転させる
function rotate(x, y, z){
  var vec = new THREE.Vector3(x, y, z),
      quat = new THREE.Quaternion().setFromEuler(vec);
  mesh.quaternion.multiplySelf(quat);

  rotateState.addSelf(vec);
  render();
}

function clickHandler(e){
  rotate(0, 0, shiftF ? 3 : -3);
}

function keydownHandler(e){
  switch(e.keyCode){
    case KEY.RIGHT: rotate(3, 0, 0); break;
    case KEY.UP:    rotate(0, 3, 0); break;
    case KEY.LEFT:  rotate(-3, 0, 0); break;
    case KEY.DOWN:  rotate(0, -3, 0); break;
    case KEY.SHIFT: shiftF = true; break;
    default: break;
  }
}

function keyupHandler(e){
  if(e.keyCode === KEY.SHIFT){
    shiftF = false;
  }
}

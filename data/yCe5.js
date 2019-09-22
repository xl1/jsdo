// forked from os0x's "Particle 100000" http://jsdo.it/os0x/5RVT
// forked from os0x's "Particle 40000" http://jsdo.it/os0x/ezL2
// forked from os0x's "Particle 10000" http://jsdo.it/os0x/30Pg
// forked from clockmaker's "Particle 3000" http://jsdo.it/clockmaker/particle

/*
* WebGL のれんしゅう
* パーティクル数減ってしまったのは残念
*/

/*
* Opera10.60 Betaならいける気がする 10まん
*/

/*
* いろいろ弄ってみたけど、パフォーマンス自体はほとんど変わってない…
* 単にFPS落として40000パーティクル
* Opera10.60 Betaが最適
*/

/*
* Canvas での擬似lock/unlockとか使って無理やり 10000 パーティクル
* 参考: http://ss-o.net/game2d/tech.html#C12
*/

/**
* みんな大好きパーティクル
* (JavaSript, HTML5バージョン)
*
* @author clockmaker
* @see http://clockmaker.jp/blog/
*
* wonderflのパーティクル祭りを参考
* http://wonderfl.net/c/436W/
*/

// -----------------------------------------
// 定数
// -----------------------------------------
var MAX_NUM = 50000; // パーティクルの個数
var FPS = 20;
var FRAMERATE = FPS / 1000 >> 0; // フレームレート

// -----------------------------------------
// クラス定義
// -----------------------------------------
/**
* パーティクル
*/
/*function Particle(x,y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
}*/

// -----------------------------------------
// 初期化
// -----------------------------------------

// 変数の初期化
var mouseX = 0;
var mouseY = 0;

// キャンバスの初期化
var canvas = document.getElementById("world");
var gl = canvas.getContext('experimental-webgl') || canvas.getContext('webgl');
var width = canvas.width;
var height = canvas.height;

gl.clearColor(0, 0, 0, 1);
gl.viewport(0, 0, width, height);

// シェーダの初期化
var shaders = initShader();

//var particles = [];
var particleArray = new Array(MAX_NUM * 4);
// パーティクルの初期化
for(var i = MAX_NUM * 4 + 4; i -= 4;){
  particleArray[i    ] = Math.random() * width;
  particleArray[i + 1] = Math.random() * height;
  particleArray[i + 2] = 0;
  particleArray[i + 3] = 0;
}
// FPS の表示
var fps_view = document.getElementById('fps');
var Counter = 0, last = +new Date();

// イベントハンドラの登録
canvas.onmousemove = mouseMoveHandler;
setInterval(enterFrameHandler, FRAMERATE);

// -----------------------------------------
// イベントハンドラ
// -----------------------------------------

/**
* マウスが動いたとき
*/
function mouseMoveHandler(e) {
  // var rect = e.target.getBoundingClientRect();
  // マウス座標の更新(もっとスマートな方法ある？)
  //  → スマートではないけどoffsetで
  //mouseX = e.clientX - canvas.offsetLeft;
  //mouseY = e.clientY - canvas.offsetTop;
  //    → layer
  mouseX = e.layerX;
  mouseY = e.layerY;
}

/**
* タイマー
*/
function enterFrameHandler() {
  // 初期化
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniform1f(shaders.uWidth, width);
  gl.uniform1f(shaders.uHeight, height);

  var vpos = [];

  var gravityX = mouseX;
  var gravityY = mouseY;

  for(var i = MAX_NUM * 4 + 4; i -= 4;){
    var x  = particleArray[i    ], y  = particleArray[i + 1];
    var vx = particleArray[i + 2], vy = particleArray[i + 3];

    var diffX = gravityX - x;
    var diffY = gravityY - y;
    var acc = 50 / (diffX * diffX + diffY * diffY);

    vx += acc * diffX;
    vy += acc * diffY;
    x += vx;
    y += vy;

    particleArray[i + 2] = 0.96 * vx;
    particleArray[i + 3] = 0.96 * vy;
    vpos[vpos.length] = particleArray[i] =
      (x > width) ? 0 : (x < 0) ? width : x;
    vpos[vpos.length] = particleArray[i + 1] =
      (y > height) ? 0 : (y < 0) ? height: y;
  }

  // 描画
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vpos), gl.STATIC_DRAW);
  gl.vertexAttribPointer(shaders.aVPos, 2, gl.FLOAT, false, 0, 0);
  // これで書ける
  gl.drawArrays(gl.POINTS, 0, MAX_NUM);
  gl.deleteBuffer(buffer); // だいじ

  if (++Counter > FPS){
    var now = +new Date();
    var _f = 1000 / ((now - last) / Counter);
    last = now;
    Counter = 0;
    fps_view.innerHTML = 'FPS '+_f.toFixed(2);
  }
}

function initShader(){
  var program = gl.createProgram();
  gl.attachShader(program, getShader('fshader', gl.FRAGMENT_SHADER));
  gl.attachShader(program, getShader('vshader', gl.VERTEX_SHADER));
  gl.linkProgram(program);
  gl.useProgram(program);

  // uniform, attribute 変数を関連付け、有効化
  var numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for(var i = numUniforms; i--;){
    var uname = gl.getActiveUniform(program, i).name;
    program[uname] = gl.getUniformLocation(program, uname);
  }
  var numAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
  for(var i = numAttribs; i--;){
    var aname = gl.getActiveAttrib(program, i).name;
    gl.enableVertexAttribArray(
      program[aname] = gl.getAttribLocation(program, aname));
  }
  return program;
}
function getShader(id, type){
  var shader = gl.createShader(type);
  gl.shaderSource(shader, document.getElementById(id).innerText);
  gl.compileShader(shader);

  if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
    return alert(gl.getShaderInfoLog(shader));
  }
  return shader;
}
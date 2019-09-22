$(function(){

var origin_svg = 'http://d37seacpprxfy8.cloudfront.net';
var origin = 'http://jsrun.it';

var playing = false;
var fps = 10;
var frames = 0;
var timer = null;

$('#playbutton').click(play);
$('#fastbutton').click(function(){ changeFps(fps+1); });
$('#slowbutton').click(function(){ changeFps(fps-1); });
window.addEventListener('message', syncFrames, false);

function syncFrames(e){
  if(e.origin !== origin_svg) return;
  var res = /^_xl1_syncFrames_(\d+)$/.exec(e.data);
  if(res) frames = res[1] |0;
}

function play(){
  if(playing = !playing){
    timer = setTimeout(proceed);
    $('#playbutton').html('&#x258c;&#x2590;').css('font-size', '40px');
    postState('play');
  } else {
    clearTimeout(timer);
    $('#playbutton').html('&#x25ba;').css('font-size', '72px');
    postState('pause');
  }
}
function changeFps(newFps){
  if(0 < newFps && newFps <= 20) fps = newFps;
  $('#fpscounter').text(padZero(fps, 2));
  postState('changeFps_' + fps);
}
function postState(state){
  var message = ['', 'xl1', 'state', state].join('_');
  window.opener.postMessage(message, origin_svg);
  // ここで IE9「インターフェースがサポートされていません。」エラー
}
function proceed(){
  frames++;
  $('#framecounter').text(padZero(frames, 4));
  if(playing) timer = setTimeout(proceed, 1000 / fps);
}

function padZero(num, digit){
  return ((new Array(digit)).join('0') + num).slice(-digit);
}

});
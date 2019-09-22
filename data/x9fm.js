// forked from xl1's "Android on crack" http://jsdo.it/xl1/frBI
document.addEventListener('DOMContentLoaded', load, false);
function load(){
  var interval = 0;
  var audios = {};
  
  audios[' a1'] = wave(1);
  audios[' a2'] = wave(2);
  audios[' a3'] = wave(3);
  audios[' a1 a2'] = wave(12);
  audios[' a1 a3'] = wave(13);
  audios[' a2 a3'] = wave(23);
  audios[' a1 a2 a3'] = wave(123);
  $('controller').addEventListener('click', changetype, false);
  
  function wave(num){
    return new Audio('http://dl.dropbox.com/u/9127339/static/jsdoit/' + num + '.wav');
  }
  function changetype(){
    stopaudio();
    document.body.className = '';
    for(var i = 1; i <= 3; i++){
      if($('chk' + i).checked) document.body.className += ' a' + i;
    }
    clearInterval(interval);
    interval = setInterval(playaudio, 6400);
    playaudio();
  }
  function playaudio(){
    var audio = audios[document.body.className];
    audio.currentTime = 0;
    audio.play();
  }
  function stopaudio(){
    var audio = audios[document.body.className];
    if(audio) audio.pause();
  }
}
function $(i){ return document.getElementById(i); }

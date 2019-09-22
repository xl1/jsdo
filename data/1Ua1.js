var video = $('video'),
    textList = $('textList'),
    track = video.addTextTrack('subtitles');

init();    

function init(){
  track.mode = TextTrack.SHOWING;
  setVideo();

  textList.addEventListener('focus', resetText, false);
  $('setVideoButton').addEventListener('click', setVideo, false);
  $('addTextButton').addEventListener('click', addText, false);
}

function setVideo(){
  video.src = $('sourceURL').value;
  resetText();
}

function addText(){
  var id = (track.cues || []).length,
      start = video.currentTime - 0.05,
      end = start + 1,
      list = textList.querySelectorAll('li')[id]
  if(!list) return;
  if(start < 0) start = 0;
  list.className = 'added';
  track.addCue(new TextTrackCue(id, start, end, list.textContent));
}

function resetText(){
  var lists = textList.querySelectorAll('li');
  for(var i = lists.length; i--;){
    lists[i].className = '';
  }
  for(var i = track.cues.length; i--;){
    track.removeCue(track.cues[i]);
  }
}

function $(id){
  return document.getElementById(id);
}
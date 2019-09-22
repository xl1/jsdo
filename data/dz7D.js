var RESPONSE_THRESHOLD = 6;
var canvas = $('canv');
var ctx = canvas.getContext('2d');
var drawing = false;
var point = { x: null, y: null };

$('tools').addEventListener('mousedown', function(e){
  e.preventDefault();
  ctx.strokeStyle = e.target.style.backgroundColor;
}, false);

canvas.addEventListener('mousedown', function(e){
  e.preventDefault();
  drawing = true;
  point.x = e.layerX;
  point.y = e.layerY;
}, false);
canvas.addEventListener('mouseup', function(e){
  e.preventDefault();
  drawing = false;
}, false);
canvas.addEventListener('mousemove', function(e){
  e.preventDefault();
  if(!drawing) return;
  if(Math.abs(e.layerX - point.x) + Math.abs(e.layerY - point.y)
    < RESPONSE_THRESHOLD) return;
  ctx.beginPath();
  ctx.moveTo(point.x, point.y);
  ctx.lineTo(point.x = e.layerX, point.y = e.layerY);
  ctx.stroke();
}, false);
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.strokeStyle = '#000';
ctx.fillStyle = '#fff';
ctx.lineWidth = 4;

$('searchbutton').addEventListener('click', function(){
  var datauri = canvas.toDataURL();
  datauri = datauri
    .replace(/.*,/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  $('contentinput').value = datauri;
  $('form').submit();
}, false);

function $(i){ return document.getElementById(i); }
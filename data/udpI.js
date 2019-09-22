var API = 'http://api.jsdo.it/v0.2/code/search.json';
var IFRAME_SIZE = 465;
var NUM_HANABI = 8;

var map;

setupMap();
setupHanabi();

function setupMap(){
  map = new google.maps.Map(document.getElementById('map_canvas'), {
    center: new google.maps.LatLng(0, 0),
    zoom: 2,
    mapTypeControl: false,
    backgroundColor: 'black'
  });
  map.mapTypes.set('background', new google.maps.ImageMapType({
    minZoom: 2,
    maxZoom: 6,
    tileSize: new google.maps.Size(256, 256),
    getTileUrl: function(){
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd' +
      '1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQ' +
      'AAAAMSURBVBhXY2BgYAAAAAQAAVzN/2kAAAAASUVORK5CYII=';
    }
  }));
  map.setMapTypeId('background');
}

function setupHanabi(){
  var hanabis = [];
  var showed = 0;
  var lastPage = 0;
  getHanabi();
  for(var i = NUM_HANABI; i--;) setTimeout(drawHanabi, (i + 1) * 1000);

  function getHanabi(func){
    var apiurl = API + '?tag=hanabi&page=' + (++lastPage);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', apiurl, true);
    xhr.onload = function(){
      var response = xhr.responseText;
      var data;
      try{ data = JSON.parse(response); } catch(e) { return; }
      if(!data.results || !data.results.length) return;
      hanabis = hanabis.concat(data.results);
    };
    xhr.send(null);
  }

  function drawHanabi(old){
    if(old){
      old.remove();
      old = null;
    }
    var interval = Math.random() * 2000 + 6000;

    var index = Math.random() * hanabis.length |0;
    var hanabi = hanabis[index];
    var url = hanabi.url.replace('jsdo', 'jsrun');

    var s = Math.random() * 40 + 80;
    var x = Math.random() * 360;
    var y = Math.random() * 60 - s;
    var ol = new Overlay(map, url, x, y, s);

    if(++showed % 20 === 0) getHanabi();
    setTimeout(function(){ drawHanabi(ol); }, interval);
  }
}

function Overlay(map, src, x, y, size){
  var iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.width = iframe.height = IFRAME_SIZE;
  iframe.scrolling = 'no';
  iframe.style.position = 'absolute';
  iframe.style.opacity = '0';
  iframe.style.border = '0';
  iframe.style.outline = '0';
  iframe.style.zIndex = '-1';
  ['WebkitT', 'MozT', 'MsT', 'OT', 't'].forEach(function(x){
    iframe.style[x + 'ransformOrigin'] = '0 0';
  });
  iframe.onload = function(){
    this.style.opacity = '1';
  };
  this.iframe = iframe;
  this.west = new google.maps.LatLng(-y, x);
  this.east = new google.maps.LatLng(-y, x + size);
  this.setMap(map);
}
(function(){
  Overlay.prototype = new google.maps.OverlayView();
  Overlay.prototype.onAdd = _onAdd;
  Overlay.prototype.draw = _draw;
  Overlay.prototype.remove = _remove;
  Overlay.prototype.onRemove = _onRemove;

  function _onAdd(){
    this.getPanes().mapPane.appendChild(this.iframe);
  }
  function _draw(){
    var iframe = this.iframe;

    var proj = this.getProjection();
    var left = proj.fromLatLngToDivPixel(this.west);
    var right = proj.fromLatLngToDivPixel(this.east);
    var wwidth = proj.getWorldWidth();
    iframe.style.left = left.x + 'px';
    iframe.style.top = left.y + 'px';
    var rate = ((right.x - left.x + wwidth) % wwidth) / IFRAME_SIZE;
    ['WebkitT', 'MozT', 'MsT', 'OT', 't'].forEach(function(x){
      iframe.style[x + 'ransform'] = 'scale(' + rate + ', ' + rate + ')';
    });
  }
  function _remove(){
    this.setMap(null);
  }
  function _onRemove(){
    this.iframe.parentNode.removeChild(this.iframe);
  }
})();
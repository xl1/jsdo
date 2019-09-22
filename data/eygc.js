// forked from svggirl's "ShuffleColorFilter" http://jsdo.it/svggirl/svg_sample_filter
/*

How to use

This code is loaded before SVG animation, and run on same domain with SVG animation playing code, in the below order.

1. filter.each_text(svg_text, n)
2. filter.each_node(svg_node, n)
3. filter.complete(svg_node)

Each method is called with following timing.

* filter.each_text(svg_text, n)
Called before SVG text is loaded and added to DOM. svg_text is SVG text value, while n is current frame number.
(however, since background SVG is loading at the same time, frame number and played number is not equal)
After modifying svg_text, it is necessary to return the return value. There is no inline SVG support, thus it's impossible to call from browser.

* filter.each_node(svg_node, n)
SVG element is called whenever it is read. 
SVG element is given on svg_node, and n gives frame number.
(however, since background SVG is loading at the same time, frame number and played number is not equal)
The return value is dropped to enable direct modification on SVG element.
It could be called on most of browser that handle SVG.

* filter.complete(svg_node, background_node)
It's called after all SVG elements are loaded.
New elemtn where video SVG element is compiled is given to svg_node, whereas new element with compiled background SVG element is given to background_node.
The return value is dropped to enable direct modification on SVG element.
It could be called on most of browser that handle SVG.

//----------------------------------------------------------------------------------------

・使い方

コードはSVGアニメーション再生前に読み込まれ、
SVGアニメーション再生用のコードと同じドメイン上で以下の順番で実行されます。

1. filter.each_text(svg_text, n)
2. filter.each_node(svg_node, n)
3. filter.complete(svg_node)

それぞれのメソッドは以下のタイミングで呼び出されます。

* filter.each_text(svg_text, n)
SVGテキストが読み込まれDOMに追加される前に呼び出されます。
svg_textはSVGのテキスト情報、nは現在のフレーム数が渡されます。
（ただし、背景用SVGも読み込まれるため、フレーム数と再生秒数は一致しません）
svg_textを変更後、返り値として返す必要があります。
インラインSVGがサポートされていないブラウザでは呼び出しが行われません。

* filter.each_node(svg_node, n)
SVG要素が読み込まれる度に呼び出されます。
svg_nodeはSVG要素、nは現在のフレーム数が渡されます。
（ただし、背景用SVGも読み込まれるため、フレーム数と再生秒数は一致しません）
SVG要素を直接変更できるため、返り値は破棄されます。
SVGを扱うことのできるブラウザ全般で呼び出されます。

* filter.complete(svg_node, background_node)
SVG要素がすべて読み込まれた後に呼び出されます。
svg_nodeは動画SVG要素が格納されている親要素、background_nodeは背景SVG要素が格納されている親要素が渡されます。
SVG要素を直接変更できるため、返り値は破棄されます。
SVGを扱うことのできるブラウザ全般で呼び出されます。
*/

if (typeof filter === 'undefined') {
    var filter = {};
}
filter.dummy = 0;

(function(){
  var DEFAULT_ADDRESS = '渋谷駅';
  
  var startFrame = 32;
  var path = [[
    674, 40,
    696, 47,
    722, 52,
    752, 59,
    790, 64
  ], [
    130, 651,
    185, 679,
    254, 707,
    336, 736
  ], [
    119, 162,
    190, 194,
    268, 226,
    351, 263,
    442, 301,
    544, 325,
    646, 342
  ], [
    221, 382,
    342, 422,
    456, 449,
    577, 479,
    693, 501,
    795, 518,
    895, 530,
    983, 537,
    1054, 544,
    1123, 546,
    1173, 543,
    1220, 539,
    1261, 539,
    1293, 534,
    1343, 544,
    1343, 544,
    1367, 550,
    1382, 562,
    1400, 572,
    1414, 589
  ]];
  var css1 = '\
g[id^="old"]{\
  display: none;\
}';
  var css2 = '\
#_xl1_canv{\
  width:100%;\
  height:100%;\
  position: relative;\
  background: white;\
  z-index: -99;\
}\
#_xl1_container{\
  position: absolute;\
  left: 50%;\
  top: 50%;\
  margin: -15px -200px;\
  width: 400px;\
  height: 30px;\
}\
#_xl1_container * {\
  width: 100%;\
  font-size: 25px;\
}';
  
  var head = document.querySelector('head');
  var style1 = addElement('style', {}, css1, head);
  var style2 = addElement('style', {}, css2, head);
  var canv = addElement('div', {id: '_xl1_canv'});
  var cnt = addElement('div', {id: '_xl1_container'});
  var input = addElement('input', {
    type: 'text',
    value: DEFAULT_ADDRESS,
    placeholder: '住所,郵便番号,緯度経度,目印,"ここ"'
  }, 0, cnt);
  addElement('br', {}, 0, cnt);
  var button = addElement('button', {}, 'OK', cnt);
  button.addEventListener('click', loadApi, false);

  /* --- --- --- */
  // cancel _9.svg.play_svg call;
  var play_svg = _9.svg.play_svg;
  var args;
  _9.svg.play_svg = function(){ args = arguments; };

  /* --- --- --- */
  
  function loadApi(){
    window['_xl1_loadImage'] = loadImage;
    jQuery.ajax({
      url: 'http://maps.google.com/maps/api/js',
      dataType: 'script',
      data: {
        sensor: 'false',
        callback: '_xl1_loadImage'
      },
      cache: true
    });
  }
  function loadImage(){
    var query = {
      address: input.value || DEFAULT_ADDRESS
    };
    if(query.address === 'here' || query.address === 'ここ'){
      if(!navigator.geolocation) return error();
      navigator.geolocation.getCurrentPosition(function(pos){
        getLatLng([{
          geometry: {
            location: new google.maps.LatLng(
              pos.coords.latitude,
              pos.coords.longitude
            )
          }
        }], google.maps.GeocoderStatus.OK);
      }, error);
    } else {
      (new google.maps.Geocoder()).geocode(query, getLatLng);
    }
  }
  function getLatLng(results, status){
    if(status != google.maps.GeocoderStatus.OK) return error();
    var latlng = results[0].geometry.location;
    (new google.maps.StreetViewService())
      .getPanoramaByLocation(latlng, 100, getImage);
  }
  function getImage(result, status){
    if(status != google.maps.StreetViewStatus.OK) return error();
    var viewOpts = {
      heading: 0,
      pitch: 10,
      zoom: 1
    };
    var map = new google.maps.StreetViewPanorama(canv, {
      position: result.location.latLng,
      pov: viewOpts,
      navigationControl: false,
      addressControl: false,
      linksControl: false
    });
    setFramefunc(map, viewOpts);
    // continue
    document.body.removeChild(cnt);
    play_svg.apply(this, args);
  }
  function setFramefunc(map, viewOpts){
    var phix = 0.1;
    var phiy = 0.0;
  
    var counter = 0;
    for(var i = 0; i < path.length; i++){
      var p = path[i];
      for(var j = 2; j < p.length; j+=2){
        _9.svg.frame_func[startFrame + (counter++) + ''] = (function(dx, dy){
          return function(){
            viewOpts.heading -= dx * phix;
            viewOpts.heading += dy * phiy;
            map.setPov(viewOpts);
          };
        })(p[j] - p[j-2], p[j+1] - p[j-1]);
      }
    }
    _9.svg.frame_func[startFrame + counter + ''] = function(){
      head.removeChild(style1);
    };
  }
  function error(info){
    alert(info || '読み込み失敗しました');
  }
  
  /* --- ---- --- */
  
  function addElement(tagName, attr, inner, parent){
    var ele = document.createElement(tagName);
    for(var a in attr) ele.setAttribute(a, attr[a]);
    if(inner) ele.appendChild(document.createTextNode(inner));
    (parent || document.body).appendChild(ele);
    return ele;
  }
})();
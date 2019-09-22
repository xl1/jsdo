// forked from svggirl's "ShuffleColorFilter" http://jsdo.it/svggirl/svg_sample_filter
/*
IE9 で動きません。
音楽は一切操作できないので #skip_all のほうがいいか。
(http://jsdo.it/event/svggirl/filter/xl1/bUHw#skip_all)
背景のスクロールは一時停止しません。
*/

if (typeof filter === 'undefined') {
    var filter = {};
}
filter.complete = function(){
  var origin_player = 'http://jsrun.it';
  var player = '../data/tIDC.html';
  
  var _9_svg_play_svg   = _9.svg.play_svg;
  var _9_svg_end        = _9.svg.end;
  var _9_svg_show_frame = _9.svg.show_frame;
  
  var style = '\._xl1_label{position:absolute;left:0;top:40%;width:100%;height:auto;background:rgba(0,0,0,.8);text-align:center;font-size:30px;line-height:50px;color:white;}._xl1_button{display:inline-block;width:20%;height:50px;margin:0 10px;background:#bbc;}._xl1_button:hover{color:#234;cursor:pointer;}';
  
  _9.svg.play_svg = function(){
    var args = arguments;
    var styleElem = $('<style>').text(style).appendTo('body');
    var yesButton = $('<div class="_xl1_button">')
      .text('Yes')
      .click(showPlayer);
    var noButton = $('<div class="_xl1_button">')
      .text('No')
      .click(playNormal);
    var dialog = $('<div class="_xl1_label">')
      .text('Show player?')
      .append(yesButton)
      .append(noButton)
      .appendTo('body');
      
    function showPlayer(){
      styleElem.remove();
      dialog.remove();
      
      var playerWin = open(player, '',
        'width=380,height=100,menubar=no,toolbar=no');
      window.addEventListener('message', listenPlayer, false);
      setTimeout(syncFrames, 1000);
      _9.svg.end = function(){
        playerWin.close();
        window.removeEventListener('message', listenPlayer, false);
        _9_svg_end.apply(this, arguments);
      };
      _9_svg_play_svg.apply(this, args);
      _9.svg.pause();
      
      function syncFrames(){
        if(playerWin.opener === window){
          playerWin.postMessage(
            '_xl1_syncFrames_' + _9.svg.position, origin_player);
          setTimeout(syncFrames, 1000);
        }
      }
    }
    function playNormal(){
      styleElem.remove();
      dialog.remove();
      _9_svg_play_svg.apply(this, args);
    }
  };
  function listenPlayer(e){
    if(e.origin !== origin_player) return;
    var data = e.data.split('_');
    switch(data[3]){
      case 'play':
        if(!_9.svg.timer){
          _9.svg.timer = setTimeout(_9.svg.show_frame);
        } else {
          _9.svg.show_frame = _9_svg_show_frame;
        }
        break;
      case 'pause':
        _9.svg.show_frame = function(){
          setTimeout(_9.svg.show_frame, 50);
        };
        break;
      case 'changeFps':
        config.fps = (data[4] |0) || config.fps;
        break;
    }
  }
};
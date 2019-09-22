// forked from ginpei's "jQuery1.6の相対値CSSが動かない" http://jsdo.it/ginpei/sItp

// jQuery が 'px' つけ忘れている気がします……。
// jquery-1.6.js の 6231行目の末尾に「 + 'px'」を付けるか、
// 6222行目で type をキャッシュするのをやめれば意図したように動く。
// width, height については、6308行目から cssHooks が設定されていて、
// 数値をもらうと px を付けるようになっている（6355行目）のでちゃんと動いてる？

$('button').click(function() {
  $('#d1').css('top', '+=10px'); // style['top'] = 60 だめ。
  $('#d2').css('top', '-=50px'); // style['top'] = 0  うごく。
  $('#d1').css('width', '-=50px'); // うごく。
  $('#d2').css('width', '+=50px'); // うごく。
});


// forked from yuitest's "安全なつもりのeval：alertしてみてください" http://jsdo.it/yuitest/dxSe
function SecureEval(str) {
  var str2 = '';
  var allow = ['JSON','Number','String','Math','Date'];
  for (var name in window) {
    if (allow.indexOf(name) === -1) {
      str2 += 'var ' + name + ' = void 0;';
    }
  }
  str2 += 'var Function = void 0;'
  return evalInner.apply({}, [str2, str])
  function evalInner () {
    eval(arguments[0]);
    try {
　　　　return eval(arguments[1]);
    } catch (e) {
      return e;
    }  	
  }
}
$(function () {
  $('#letsEval').click(function (e) {
    $('#returnText').val(SecureEval($('#evalText').val()).toString());
  });
});
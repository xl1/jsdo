/* --- data --- */
var exampleData = [{
  name: '例1: 正規表現 /^aa?b*c$/',
  numOpr: 4,
  numOut: 1,
  operations: 'a\nb\nc\nEOS',
  outputs: 'state',
  data: '\t1\t2\t3\t4\t1\n' +
    '1\t2\t5\t5\t5\t1\n' +
    '2\t3\t3\t4\t5\t2\n' +
    '3\t5\t3\t4\t5\t3\n' +
    '4\t5\t5\t5\t6\t4\n' +
    '5\t-\t-\t-\t-\t5(error)\n' +
    '6\t-\t-\t-\t-\t6(accept)'
}, {
  name: '例2: 自動販売機',
  numOpr: 4,
  numOut: 2,
  operations:
    '100円投入\n' +
    '50円投入\n' +
    '購入\n' +
    'お釣り',
  outputs: '内部\n排出',
  data: '\t1\t2\t3\t4\t1\t2\n' +
    '1\t3\t2\t-\t-\t0円\t\n' +
    '2\t4\t3\t-\t6\t50円\t\n' +
    '3\t5\t4\t-\t7\t100円\t\n' +
    '4\t-\t5\t10\t8\t150円\t\n' +
    '5\t-\t-\t11\t9\t200円\t\n' +
    '6\t3\t2\t1\t1\t0円\t50円\n' +
    '7\t3\t2\t1\t1\t0円\t100円\n' +
    '8\t3\t2\t1\t1\t0円\t150円\n' +
    '9\t3\t2\t1\t1\t0円\t200円\n' +
    '10\t3\t2\t1\t1\t0円\tジュース\n' +
    '11\t4\t3\t2\t6\t50円\tジュース'
}, {
  name: '例3: ゲームブックのようなもの',
  numOpr: 2,
  numOut: 1,
  operations: 'A\nB',
  outputs: '>',
  data: '\t1\t2\t1\n' +
    '1\t16\t8\t君は大きな洞窟の中にいる。目の前に道がふたつ続いている。\\A ' +
      'A: 右へ進む\\A B: 左へ進む\n' +
    '2\t1\t1\tそれから10日、君は痛みと脱水に苦しみながら息を引き取った。\\A Game over\n' +
    '3\t17\t17\t尻尾を切られたドラゴンは叫び声をあげてぐったり横たわる。やった、倒したぞ！\\A ' +
      'A,B: 次へ\n' +
    '4\t12\t7\t小人「ここはぼくたちの土地だ。この先には進ませないよ。」\\A ' +
      'A: 戦う\\A B: 諦めて戻る\n' +
    '5\t10\t13\tドラゴンのいる向こう側に出口が見える。どうにかして通り抜けるしかない。\\A ' +
      'A: 戦う\\A B: こっそり通り抜ける\n' +
    '6\t2\t2\t君は大穴に気づかず落ちて、足を折ってしまった。\\A ' +
      'A,B: 次へ\n' +
    '7\t9\t1\tおや、さっきは気付かなかったが、天井にぽっかり穴が開いている。\\A ' +
      'A: 穴を登る\\A B: 無視\n' +
    '8\t12\t4\tしばらく歩いていると、君の前に小人（こびと）があらわれた。\\A ' +
      'A: 戦う\\A B: 話をする\n' +
    '9\t13\t5\tなんと、そこはドラゴンの巣になっていた！ドラゴンに見つかる前に逃げなくては……\\A ' +
      'A: 戻る\\A B: 他の逃げ道を探す\n' +
    '10\t15\t3\tさあ、君はドラゴンの……\\A ' +
      'A: 頭を攻撃\\A B: 尻尾を攻撃\n' +
    '11\t14\t14\t音がどんどん近づいてくる。後ろを振り向くと、大蛇の舌が迫ってきている！\\A ' +
      'A: 急いで進む\\A B: 慎重に進む\n' +
    '12\t1\t1\t小人が口笛を吹き、君はいつの間にか小人の大群に囲まれていたことに気づく。君は捕まった。\\A Game over\n' +
    '13\t15\t15\t駄目だ、君は気づかれてしまった。\\A ' +
      'A,B: 逃げる\n' +
    '14\t1\t1\t間に合わなかった。君は一飲みにされて死んだ。\\A Game over\n' +
    '15\t1\t1\t君は怒ったドラゴンの炎に全身を包まれて死んだ。\\A Game over\n' +
    '16\t6\t11\t歩いていると、後ろのほうからなにかを引きずるような音が聞こえてくる。\\A ' +
      'A: 急いで進む\\A B: 慎重に進む\n' +
    '17\t1\t1\t君は目を覚ます。どうやら、すべて夢だったようだ……。\\A Fin.'
}];
    
/* --- --- --- */

init();

function init(){
  var defaultCss = '\
#result input {\n\
\tdisplay: none;\n\
}\n\
#panel {\n\
\tposition: relative;\n\
}\n\
#panel label {\n\
\tdisplay: none;\n\
\tposition: absolute;\n\
\tleft: 0;\n\
\ttop: 0;\n\
\tz-index: 2;\n\
\tbackground: #fff;\n\
\topacity: .1;\n\
}\n\
#panel .button, #panel label {\n\
\twidth: 100px;\n\
\theight: 25px;\n\
\tmargin: 0;\n\
\tcursor: pointer;\n\
}\n\
#panel .button {\n\
\tdisplay: inline-block;\n\
\ttext-align: center;\n\
\tbackground: #eee;\n\
\tborder-bottom: 2px solid #aaa;\n\
\tborder-right: 2px solid #aaa;\n\
\tbox-sizing: border-box;\n\
}\n\
#panel .output {\n\
\twhite-space: pre-line;\n\
}\n\n';

  var dataArea = $('#data');
  dataArea.keydown(enableTab);
  var examples = $('#examples');
  examples.change(setExamples);
  prepareExamples();
  setExamples();
  
  $('#generateButton').click(generate);
  $('#numOperations, #numOutputs').bind('input', setColumns);
  
  function prepareExamples(){
    for(var i = 0; i < exampleData.length; i++){
      examples.append(
        $('<option>').text(exampleData[i].name)
      );
    }
  }
  
  function setExamples(){
    var ex = exampleData[examples[0].selectedIndex];
    $('#numOperations').val(ex.numOpr);
    $('#numOutputs').val(ex.numOut);
    $('#operations').val(ex.operations);
    $('#outputs').val(ex.outputs);
    dataArea.val(ex.data);
  }
  
  function setColumns(){
    var numOpr = $('#numOperations').val() -0;
    var numOut = $('#numOutputs').val() -0;
    if(isNaN(numOpr) || isNaN(numOut)) return;
    var data = dataArea.val();
    
    dataArea.val(data.replace(/.*?(\n|\r)+/, function(m, m1){
      var res = new Array(1);
      for(var i = 1; i <= numOpr; i++) res.push(i);
      for(    i = 1; i <= numOut; i++) res.push(i);
      return res.join('\t') + m1;
    }));
  }
  
  function generate(){
    var numOpr = $('#numOperations').val() -0;
    var numOut = $('#numOutputs').val() -0;
    if(isNaN(numOpr) || isNaN(numOut)) return;
    var val = dataArea.val().split(/[\n\r]+/);
    var obj = val.map(function(e){
      return e.split('\t');
    });
    
    var r, c, num;
    
    // generate CSS
    var css = [defaultCss];
    for(c = 1; c <= numOpr; c++){
      var cssb = [];
      for(r = 1; r < obj.length; r++){
        num = obj[r][c] -0;
        if(!isNaN(num) && r !== num)
          cssb.push('#i'+r+':checked ~ #panel #l'+num+'_'+c);
      }
      if(cssb.length){
        css.push(
          cssb.join(',\n') +
          ' {\n\tdisplay: block; left: ' + 100*(c-1) + 'px;\n}'
        );
      }
    }
    for(c = 1; c <= numOut; c++){
    for(r = 1; r < obj.length; r++){
      var content = obj[r][numOpr + c];
      if(content){
        css.push(
          '#i'+r+':checked ~ #panel #o'+c+'::after' +
          ' { content: "'+content+'"; }'
        );
      }
    }}
    
    // generate HTML
    var html = ['<div id="result">'];
    for(r = 1; r < obj.length; r++){
      var radio = '<input type="radio" name="state" id="i'+r+'"' +
        (r === 1 ? ' checked' : '') +
        '>';
      html.push(radio);
    }
    html.push('<div id="panel">');
    for(c = 1; c <= numOpr; c++){
      var chk = new Array(obj.length);
      for(r = 1; r < obj.length; r++){
        num = obj[r][c] -0;
        if(!isNaN(num) && !chk[num]){
          html.push('<label for="i'+num+'" id="l'+num+'_'+c+'"></label>');
          chk[num] = true;
        }
      }
    }
    var opr = $('#operations').val().split(/[\n\r]+/).map(htmlEscape);
    var out = $('#outputs').val().split(/[\n\r]+/).map(htmlEscape);
    for(var i = 0; i < numOpr; i++)
      html.push('<div class="button">' + opr[i] + '</div>');
    for(    i = 0; i < numOut; i++)
      html.push('<div class="output" id="o'+(i+1)+'">' + out[i] + ': </div>');
      
    html.push('</div>'); // end of #panel
    html.push('</div>'); // end of #result
    
    // output CSS and HTML
    var cssText = css.join('\n');
    var htmlText = html.join('\n');
    $('#resultStyle').text(cssText);
    //$('#result')[0].outerHTML = htmlText; // Firfox doesnt support outerHTML
    $('#result').before(htmlText).remove();
    $('#resultCss').val(cssText);
    $('#resultHtml').val(htmlText);
  }
}

function enableTab(e){
  var TAB = '\t';
  if(String.fromCharCode(e.keyCode) !== TAB) return;
  if(e.shiftKey) return;
  var val = this.value;
  var ss = this.selectionStart, se = this.selectionEnd;
  this.value = val.substring(0, ss) + TAB + val.substring(se);
  this.focus();
  this.selectionStart = ss + TAB.length;
  this.selectionEnd = se + TAB.length;
  e.preventDefault();
}
function htmlEscape(str){
  var refs = {
    '&': '&amp;',  '<': '&lt;',   '>': '&gt;',
    "'": '&apos;', '"': '&quot;', ' ': '&nbsp;'
  };
  return str.replace(/[<>&'" ]/g, function(s){ return refs[s]; });
}
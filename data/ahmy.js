(function() {
  var $, addCSS, createURL, main;

  $ = function(id) {
    return document.getElementById(id);
  };

  createURL = function(text) {
    return URL.createObjectURL(new Blob([text], {
      type: 'text/plain'
    }));
  };

  addCSS = function(text) {
    var style;
    style = document.createElement('style');
    style.textContent = text;
    return document.head.appendChild(style);
  };

  main = function() {
    var cfgl, copy, fsh, furl, vsh, vurl;
    vsh = $('vshader').textContent;
    fsh = $('fshader').textContent;
    vurl = createURL(vsh);
    furl = createURL(fsh);
    addCSS("#filtered { -webkit-filter: custom(url('" + vurl + "') mix(url('" + furl + "') normal source-atop)); }");
    copy = $('target').cloneNode(true);
    copy.setAttribute('id', 'filtered');
    document.body.insertBefore(copy, $('dest'));
    cfgl = (new CustomFilterGL($('dest'), 450, 135)).shader(vsh, fsh, true).mesh();
    return html2canvas([$('target')], {
      onrendered: function(canv) {
        return cfgl.source(canv).draw();
      }
    });
  };

  main();

}).call(this);

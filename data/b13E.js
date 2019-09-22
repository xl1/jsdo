(function() {
  var $, createShaderURL, fshader, main, vshader;

  vshader = 'attribute vec4 a_position;\nattribute vec3 a_triangleCoord;\nuniform mat4 u_projectionMatrix;\n\nvarying vec3 v_triangleCoord;\n\nvoid main(){\n	v_triangleCoord = a_triangleCoord;\n	gl_Position = u_projectionMatrix * a_position;\n}';

  fshader = 'precision mediump float;\n\nuniform vec2 u_meshSize;\n\nvarying vec3 v_triangleCoord;\n\nvoid main(){\n	gl_FragColor = vec4(v_triangleCoord / vec3(u_meshSize, 6.0), 1.0);\n}';

  $ = function(id) {
    return document.getElementById(id);
  };

  createShaderURL = function(content) {
    var blob;
    blob = new Blob([content], {
      type: 'text/plain'
    });
    return URL.createObjectURL(blob);
  };

  main = function() {
    var fsh, style, vsh;
    vsh = createShaderURL(vshader);
    fsh = createShaderURL(fshader);
    style = document.createElement('style');
    document.head.appendChild(style);
    return style.innerText = "#test {\n    -webkit-filter: custom(url(" + vsh + ") url(" + fsh + "), 5 5);\n}\n#test:hover {\n    -webkit-filter: custom(url(" + vsh + ") url(" + fsh + "), 5 5 detached);\n}";
  };

  main();

}).call(this);

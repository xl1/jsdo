(function() {
  var $text, initCSSfilter, initGlsl, initMicrogl, initThree, main, makeURL;

  $text = function(id) {
    return document.getElementById(id).textContent;
  };

  makeURL = function(text, type) {
    if (type == null) {
      type = 'text/plain';
    }
    return window.URL.createObjectURL(new Blob([text], {
      type: type
    }));
  };

  initThree = function() {
    var camera, mesh, renderer, scene, uniforms;
    uniforms = {
      time: {
        type: 'f',
        value: 0
      }
    };
    mesh = new THREE.Mesh(new THREE.PlaneGeometry(128, 128, 1, 1), new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: $text('vshader-threejs'),
      fragmentShader: $text('fshader')
    }));
    camera = new THREE.PerspectiveCamera(45, 1, 1, 100);
    scene = new THREE.Scene();
    scene.add(mesh);
    scene.add(camera);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(128, 128);
    document.body.insertAdjacentHTML('beforeend', '<div>three.js</div>');
    document.body.appendChild(renderer.domElement);
    return function(time) {
      uniforms.time.value = time;
      return renderer.render(scene, camera);
    };
  };

  initGlsl = function() {
    var canvas;
    document.body.insertAdjacentHTML('beforeend', '<div>glsl.js</div>');
    canvas = document.createElement('canvas');
    canvas.width = canvas.height = 128;
    document.body.appendChild(canvas);
    return Glsl({
      canvas: canvas,
      fragment: $text('fshader'),
      variables: {
        time: 0
      },
      update: function(time) {
        return this.set('time', time);
      }
    }).start();
  };

  initMicrogl = function() {
    var gl;
    document.body.insertAdjacentHTML('beforeend', '<div>MicroGL</div>');
    gl = new MicroGL().init(document.body, 128, 128).program($text('vshader-microgl'), $text('fshader')).bindVars({
      position: [0, 0, 0, 1, 1, 0, 1, 1]
    });
    return function(time) {
      return gl.bindVars({
        time: time
      }).draw();
    };
  };

  initCSSfilter = function() {
    var div, fshader, link, stylesheet;
    fshader = makeURL($text('fshader'));
    stylesheet = "@-webkit-keyframes filter {\n  from { -webkit-filter: custom(none url(" + fshader + "), time 0); }\n  to { -webkit-filter: custom(none url(" + fshader + "), time 1000000); }\n}\n.filter {\n  width: 128px;\n  height: 128px;\n  -webkit-animation: filter 1000s linear infinite;\n}";
    link = document.createElement('link');
    link.href = makeURL(stylesheet, 'text/css');
    link.rel = 'stylesheet';
    div = document.createElement('div');
    div.className = 'filter';
    document.head.appendChild(link);
    document.body.insertAdjacentHTML('beforeend', '<div>CSS custom filter</div>');
    return document.body.appendChild(div);
  };

  main = function() {
    var start, update, updateMicrogl, updateThree;
    updateThree = initThree();
    initGlsl();
    updateMicrogl = initMicrogl();
    initCSSfilter();
    start = Date.now();
    return (update = function() {
      var time;
      time = Date.now() - start;
      updateThree(time);
      updateMicrogl(time);
      return requestAnimationFrame(update);
    })();
  };

  main();

}).call(this);

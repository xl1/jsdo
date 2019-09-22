(function() {
  var constant, frame, fshader, gl, main, modelView, program, startT, update, vshader, xhrget;

  vshader = {
    noblur: 'attribute vec3 position;\nattribute vec3 normal;\nuniform mat4 modelView;\nuniform mat4 perspective;\nvarying vec3 vNormal;\n\nvoid main(){\n  gl_Position = perspective * modelView * vec4(position, 1.0);\n  vNormal = mat3(modelView) * normal;\n}',
    velmap: 'attribute vec3 position;\nattribute vec3 normal;\nuniform mat4 modelView;\nuniform mat4 prevModelView;\nuniform mat4 perspective;\nvarying vec2 velocity;\n\nvoid main(){\n  vec4 pos = modelView * vec4(position, 1.0);\n  vec4 ppos = prevModelView * vec4(position, 1.0);\n  vec3 vel = (pos - ppos).xyz;\n  vec3 nrm = mat3(modelView) * normal;\n  \n  vec4 posproj = perspective * pos;\n  vec4 pposproj = perspective * ppos;\n\n  gl_Position = (dot(nrm, vel) >= 0.0) ? posproj : pposproj;\n  velocity = posproj.xy / posproj.w - pposproj.xy / pposproj.w;\n}',
    noop: 'attribute vec2 position;\nvoid main(){ gl_Position = vec4(position, 0.0, 1.0); }'
  };

  fshader = {
    noblur: 'precision mediump float;\nuniform vec3 light;\nvarying vec3 vNormal;\n\nvoid main(){\n  vec3 color = dot(normalize(light), vNormal) * vec3(1.0, 1.0, 0.0);\n  float depth = gl_FragCoord.z / gl_FragCoord.w / 100.0;\n  gl_FragColor = vec4(color + vec3(0.1), depth);\n}',
    velmap: 'precision mediump float;\nvarying vec2 velocity;\nvoid main(){\n  vec2 vel = fract(clamp(velocity, -0.5, 0.5));\n  gl_FragColor = vec4(vel, 1.0, 1.0);\n}',
    main: 'precision mediump float;\nuniform sampler2D noblur;\nuniform sampler2D velmap;\nuniform float size;\nvoid main(){\n  vec2 ref = gl_FragCoord.xy / size;\n  vec2 vel = fract(texture2D(velmap, ref).xy + vec2(0.5)) - vec2(0.5);\n\n  vec4 target = texture2D(noblur, ref);\n  float baseDepth = target.w;\n  vec3 color = target.rgb;\n  float count = 1.0;\n  for(int i = 1; i < 16; i++) {\n    target = texture2D(noblur, ref + vel * float(i) / 15.0);\n    if(target.w <= baseDepth + 0.01){\n      // 手前になかったら足す\n      count += 1.0;\n      color += target.rgb;\n    }\n  }\n  gl_FragColor = vec4(color / count, 1.0);\n}'
  };

  xhrget = function(url, callback) {
    var xhr;
    xhr = new XMLHttpRequest;
    xhr.open('GET', url, true);
    xhr.onload = function() {
      return callback(xhr.responseText);
    };
    return xhr.send(null);
  };

  gl = new MicroGL();

  program = {};

  constant = {};

  frame = {};

  startT = 0;

  modelView = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 30, 1];

  main = function(json) {
    var teapot;
    teapot = JSON.parse(json).Teapot01;
    gl.init(document.body);
    program.noblur = gl.makeProgram(vshader.noblur, fshader.noblur);
    program.velmap = gl.makeProgram(vshader.velmap, fshader.velmap);
    program.main = gl.makeProgram(vshader.noop, fshader.main);
    constant.noblur = gl.program(program.noblur).variable({
      position: teapot.position,
      normal: teapot.normal,
      INDEX: teapot.INDEX,
      perspective: [2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1.01, 1, 0, 0, -1.01, 0],
      light: [1, 1, -0.5]
    });
    constant.main = gl.program(program.main).variable({
      position: [-1, -1, -1, 1, 1, -1, 1, 1],
      size: gl.width
    });
    frame.noblur = gl.frame();
    frame.velmap = gl.frame();
    updating.addEventListener('change', function() {
      if (this.checked) {
        return update();
      }
    }, false);
    startT = Date.now();
    return update();
  };

  update = function() {
    var prevModelView, t;
    if (!updating.checked) {
      return;
    }
    t = 0.005 * (Date.now() - startT);
    prevModelView = new Float32Array(modelView);
    modelView = [Math.cos(t), 0, -Math.sin(t), 0, 0, 1, 0, 0, Math.sin(t), 0, Math.cos(t), 0, 0, 0, 30, 1];
    gl.program(program.noblur).bind(constant.noblur).bindVars({
      modelView: modelView
    }).clearFrame(frame.noblur).drawFrame(frame.noblur).program(program.velmap).bind(constant.noblur).bindVars({
      modelView: modelView,
      prevModelView: prevModelView
    }).clearFrame(frame.velmap).drawFrame(frame.velmap).program(program.main).bind(constant.main).bindVars({
      noblur: frame.noblur.color,
      velmap: frame.velmap.color
    }).clear().draw();
    return requestAnimationFrame(update);
  };

  xhrget('../assets/kvyI0', main);

}).call(this);

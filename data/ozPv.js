function $text(id){ return document.getElementById(id).textContent; }

new MicroGL()
    .init(document.body)
    .program($text('vshader'), $text('fshader'))
    .bindVars({ position: [0,0, 0,1, 1,0, 1,1] })
    .draw();
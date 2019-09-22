// forked from 9re's "mod |z|^2" http://jsdo.it/9re/modular_z2
window.addEventListener('DOMContentLoaded', function (){
    var width = 465,
        height = 465,
        gl = new MicroGL(),
        t = 0;

    function main() {
        init();
        animate();
    }
    function init() {
        gl.init(document.body, width, height)
            .program(
                document.getElementById('vshader').textContent,
                document.getElementById('fshader').textContent
            )
            .bindVars({
                a_position: [0,0, 0,1, 1,0, 1,1],
                u_size: [width, height]
            });
    }
    function animate() {
        t += 0.004;
        gl.bindVars({ u_time: t }).clear().draw();

        requestAnimationFrame(animate);
    }

    main();
});
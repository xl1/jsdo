// forked from svggirl's "ShuffleColorFilter" http://jsdo.it/svggirl/svg_sample_filter

if(!filter) var filter = {};
filter.dummy = 0;
$('<input type="range" max="20" min="1" step="0.1">')
    .attr('value', '10')
    .css({
        'position': 'absolute',
        'left': '0',
        'top': '50%',
        'width': '100%',
        'height': '30px',
        'margin': '-15px 0',
        'z-index': '9999'
    })
    .change(function(){ config.fps = this.value -0; })
    .appendTo('body');
// forked from svggirl's "ShuffleColorFilter" http://jsdo.it/svggirl/svg_sample_filter
/*

How to use

This code is loaded before SVG animation, and run on same domain with SVG animation playing code, in the below order.

1. filter.each_text(svg_text, n)
2. filter.each_node(svg_node, n)
3. filter.complete(svg_node)

Each method is called with following timing.

* filter.each_text(svg_text, n)
Called before SVG text is loaded and added to DOM. svg_text is SVG text value, while n is current frame number.
(however, since background SVG is loading at the same time, frame number and played number is not equal)
After modifying svg_text, it is necessary to return the return value. There is no inline SVG support, thus it's impossible to call from browser.

* filter.each_node(svg_node, n)
SVG element is called whenever it is read. 
SVG element is given on svg_node, and n gives frame number.
(however, since background SVG is loading at the same time, frame number and played number is not equal)
The return value is dropped to enable direct modification on SVG element.
It could be called on most of browser that handle SVG.

* filter.complete(svg_node, background_node)
It's called after all SVG elements are loaded.
New elemtn where video SVG element is compiled is given to svg_node, whereas new element with compiled background SVG element is given to background_node.
The return value is dropped to enable direct modification on SVG element.
It could be called on most of browser that handle SVG.

*/

if (typeof filter === 'undefined') {
    var filter = {};
};
filter.each_text = function(svg_text, n) {
  var color = /#(\w\w?)(\w\w?)(\w\w?)/g;
  var colors = svg_text.match(color);
  var count = colors.length - 1;
  if (!colors.length) return svg_text;

  var text = svg_text.replace(color, sepia);
  return text;
};

function sepia(m, r, g, b){
  var color = [r, g, b];
  for(var i = 0; i < 3; i++){
    var c = color[i];
    if(c.length == 1) c += c;
    color[i] = parseInt(c, 16);
  }
  var y = color[0] * 0.30 + color[1] * 0.59 + color[2] * 0.11;
  color[0] = y * 1.00 |0;
  color[1] = y * 0.75 |0;
  color[2] = y * 0.55 |0;
  return 'rgb(' + color.join(',') + ')';
}

filter.each_text.random = function(max) {
  return Math.floor(Math.random() * (max + 1));
};


filter.each_node = function(svg_node, n) {
  log(n);
};

filter.complete = function(svg_node) {
  log('complete! total: '+svg_node.length);
};


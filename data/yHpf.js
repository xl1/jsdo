var ifr = document.querySelector('iframe');
ifr.onload = function(){
  main(ifr, ifr.contentDocument);
};
ifr.src = 'http://jsrun.it';

function main(iwin, idoc){
  replaceLink('*[href^="/"]', 'href', idoc);
  replaceLink('*[src^="/"]', 'src', idoc);
  replaceLink('form[action^="/"]', 'action', idoc);
  
  var script = idoc.createElement('script');
  script.src =
    'http://dl.dropbox.com/u/9127339/static/jsdoit/jsdo_hovercard.user.js';
  idoc.body.appendChild(script);
}

function replaceLink(query, attr, parent){
  var links = parent.querySelectorAll(query);
  for(var i = links.length; i--;){
    var val = links[i].getAttribute(attr);
    links[i].setAttribute(attr, 'http://jsdo.it' + val);
  }
}
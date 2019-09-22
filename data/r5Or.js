//var p = new Promise(function(resolver){
var p = new Promise(function(resolve, reject){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../data/r5Or.js', true);
    xhr.onload = function(){ /*resolver.*/resolve(xhr.responseText); };
    xhr.onerror = function(){ /*resolver.*/reject(xhr.status); };
    xhr.send();
});
p.then(function(text){
    console.log('OK');
}, function(status){
    console.log('error on XHR');
});

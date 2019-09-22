document.getElementById('btn').addEventListener('click', ssort, false);

function ssort(){
    var arr = document.getElementById('input').value.split(' ');
    var count = arr.length;
    var res = [];
    arr = arr.map(function(e){return parseFloat(e, 10);});
    arr.forEach(function(e){
        setTimeout(function(){
            res.push(e);
            if(!--count) print(res.join(' '));
        }, e*100);
    });
}

function print(s){
    var p = document.createElement('p');
    p.appendChild(document.createTextNode(s));
    document.body.appendChild(p);
}
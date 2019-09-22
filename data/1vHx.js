// forked from sugyan's "unique" http://jsdo.it/sugyan/xur2
//var arr = [1, 2, 3, 4, 5, 6, 3, 2, 1, 4, 5, 2, 1];
var arr = [1, 1, '1', '1', [1], [1], ['1'], [[[[[[1]]]]]]];
var u = (function() {
    var o = {};
    return arr.filter(function(v) {
        if (o[v] === undefined) {
            o[v] = true;
            return true;
        }
        return false;
    });
})();
alert(JSON.stringify(u)); //-> [1]

var w = (function() {
    var x = [];
    for (var i = 0, n = arr.length; i < n; i++) {
        if (i == arr.indexOf(arr[i])) x.push(arr[i]);
    }
    return x;
})();
alert(JSON.stringify(w)); //-> [1,"1",[1],[1],["1"],[[[[[[1]]]]]]]
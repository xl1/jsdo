eval(/\/\*(.*)\*\//.exec(function(){/*document.write('<p>This is comment!</p>')*/})[1]);
document.write('<p>This is not comment!</p>');
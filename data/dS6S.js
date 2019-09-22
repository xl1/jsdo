(function() {
  var $, connect, getId, log, main, uuid;

  uuid = (function() {
    var re, replacer;
    re = /[xy]/g;
    replacer = function(c) {
      var r;
      r = Math.random() * 16 | 0;
      return (c === 'x' ? r : r & 3 | 8).toString(16);
    };
    return function() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(re, replacer).toUpperCase();
    };
  })();

  $ = function(id) {
    return document.getElementById(id);
  };

  log = function(txt) {
    return $('log').insertAdjacentHTML('beforeend', "<li>" + txt + "</li>");
  };

  getId = function() {
    var _ref;
    return (_ref = /\Wid=([-0-9A-F]{36})/.exec(location.search)) != null ? _ref[1] : void 0;
  };

  connect = function(conn) {
    var btn;
    log("connected to: " + conn.peer);
    conn.on('data', function(data) {
      return log("received: " + (unescape(data)));
    });
    btn = $('btn');
    btn.disabled = false;
    return btn.addEventListener('click', function() {
      var str;
      str = new Date().toString();
      conn.send(escape(str));
      return log("send: " + str);
    }, false);
  };

  main = function() {
    var conn, id, img, oid, peer;
    id = uuid();
    peer = new Peer(id, {
      key: 'v9z16y8nolzvvx6r'
    });
    if (oid = getId()) {
      conn = peer.connect(oid);
      return conn.on('open', function() {
        return connect(conn);
      });
    } else {
      img = document.createElement('image');
      img.src = 'http://chart.apis.google.com/chart?chs=300x300&cht=qr&chl=' + location.href + '?id=' + id;
      document.body.appendChild(img);
      return peer.on('connection', function(conn) {
        connect(conn);
        return document.body.removeChild(img);
      });
    }
  };

  main();

}).call(this);

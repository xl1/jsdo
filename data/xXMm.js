(function() {

  window.WebCam = (function() {

    function WebCam(playCallback, failCallback) {
      var setSourceURL, userMedia,
        _this = this;
      userMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
      if (!userMedia) {
        return typeof failCallback === "function" ? failCallback() : void 0;
      }
      this.video = document.createElement('video');
      this.video.addEventListener('canplay', function() {
        return _this.video.play();
      });
      this.video.addEventListener('timeupdate', function() {
        _this.width = _this.video.videoWidth;
        _this.height = _this.video.videoHeight;
        if (_this.width || _this.height) {
          _this.video.removeEventListener('timeupdate', arguments.callee, false);
          return typeof playCallback === "function" ? playCallback() : void 0;
        }
      }, false);
      setSourceURL = function(src) {
        var url;
        url = window.URL || window.webkitURL;
        return _this.video.src = url ? url.createObjectURL(src) : src;
      };
      try {
        userMedia.call(navigator, {
          video: true
        }, setSourceURL, failCallback);
      } catch (e) {
        userMedia.call(navigator, 'video', setSourceURL, failCallback);
      }
    }

    return WebCam;

  })();

}).call(this);

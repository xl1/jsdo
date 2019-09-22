// forked from kyo_ago's "iOS4.2～の加速度、ジャイロを使ったcanvasの描画" http://jsdo.it/kyo_ago/126r
// forked from alt's "iOS4.2～の加速度センサー、ジャイロセンサーの取得" http://jsdo.it/alt/YkYd

var devicemotion = {
    // iPhone4 and iPhone3GS and iPhone3G
    'accelerationIncludingGravity' : {
    	'x' : undefined,
		'y' : undefined,
		'z' : undefined
	},
	// iPhone4 only
	'acceleration' : {
		'x' : undefined,
		'y' : undefined,
		'z' : undefined
	},
	// iPhone4 only
	'rotationRate' : {
		'alpha' : undefined,
		'beta' : undefined,
		'gamma' : undefined
	}
};

var cursorPosition = {
	'x' : undefined,
	'y' : undefined
};

(function () {
	var canvas = document.getElementsByTagName('canvas')[0];
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	var ctx = canvas.getContext('2d');
	ctx.globalCompositeOperation = 'source-over';
	ctx.fillStyle = 'rgba(0, 0, 0, 0)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.globalCompositeOperation = 'lighter';
	var center = {
		'x' : canvas.width / 2,
		'y' : canvas.height / 2
	};

	(function updateAnimation () {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		var x = devicemotion.accelerationIncludingGravity.x || cursorPosition.x || 0;
		var y = devicemotion.accelerationIncludingGravity.y || cursorPosition.y || 0;
		//accelerationIncludingGravityの値が小さいので100倍する
        //(大きすぎる値はColorHSVで丸められる)
        x *= 100;
		y *= 100;

		//グラデーション
        var grad = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, center.x);
		var start = ColorHSV(x);
		var stop = ColorHSV(y);
		grad.addColorStop(0, 'rgba('+start.join(', ')+', 1)');
		grad.addColorStop(1, 'rgba('+stop.join(', ')+', 0)');
		ctx.fillStyle = grad;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		setTimeout(updateAnimation, 200);
	})();
})();

window.addEventListener('devicemotion', function(evt) {
	devicemotion.acceleration = evt.acceleration;
	devicemotion.accelerationIncludingGravity = evt.accelerationIncludingGravity;
	devicemotion.rotationRate = evt.rotationRate;
}, false);

window.addEventListener('deviceorientation', function(evt) {
	devicemotion.rotationRate = evt.rotationRate;
}, false);
// for PC
window.addEventListener('MozOrientation', function(evt) {
    devicemotion.acceleration = { 'x' : evt.x, 'y' : evt.y };
}, false);
window.addEventListener('mousemove', function(evt) {
	cursorPosition.x = evt.clientX;
	cursorPosition.y = evt.clientY;
}, false);

// from Frocessing
function ColorHSV (h) {
	var ht = h;
	var _v = 1.0, _s = 1.0;
	ht = (((ht %= 360) < 0) ? ht + 360 : ht ) / 60;
	var vt = Math.max( 0, Math.min( 0xff, _v * 0xff ) );
	var hi = Math.floor( ht );
	var _r, _g, _b;
 
	switch (hi) {
		case 0:
			_r = vt;
			_g = Math.round( vt * ( 1 - (1 - ht + hi) * _s ) );
			_b = Math.round( vt * ( 1 - _s ) );
			break;
		case 1:
			_r = Math.round( vt * ( 1 - _s * ht + _s * hi ) );
			_g = vt;
			_b = Math.round( vt * ( 1 - _s ) );
			break;
		case 2:
			_r = Math.round( vt * ( 1 - _s ) );
			_g = vt;
			_b = Math.round( vt * ( 1 - (1 - ht + hi) * _s ) );
			break;
		case 3:
			_r = Math.round( vt * ( 1 - _s ) );
			_g = Math.round( vt * ( 1 - _s * ht + _s * hi ) );
			_b = vt;
			break;
		case 4:
			_r = Math.round( vt * ( 1 - (1 - ht + hi) * _s ) );
			_g = Math.round( vt * ( 1 - _s ) );
			_b = vt;
			break;
		case 5:
			_r = vt;
			_g = Math.round( vt * ( 1 - _s ) );
			_b = Math.round( vt * ( 1 - _s * ht + _s * hi ) );
			break;
	}
	return [_r, _g, _b];
}

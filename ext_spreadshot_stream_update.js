var export_version = 1;
var export_str = (function (_a){
	frameRequest = window.requestAnimationFrame(update);
	a = _a;

	centerX = window.innerWidth / 2; centerY = window.innerHeight / 2;

	if(!bulletFoundInLastFrame && bulletFound){
		var interval = a - bulletFoundA;
		bulletFoundA = a;
		if(interval > CYCLE_LEN_MIN && interval < CYCLE_LEN_MAX){
			cycleLen = 0.8 * cycleLen + 0.2 * interval;
		}

		if(bulletDelayMeasureEffective && bulletDelayMeasure){
			bulletDelayMeasure = false;
			var delay = a - bulletDelayMeasureStartA;
			if(delay > BULLET_DELAY_MIN && delay < BULLET_DELAY_MAX)bulletDelayEMA = bulletDelayEMA * 0.7 + delay * 0.3;
		}
	}

	selfFound = false;
	bulletFoundInLastFrame = bulletFound;
	bulletFound = false;
	scaleDetected = false;

	if(effective){
		var da = Math.min(a - mouseDownA, a - (bulletFoundA - bulletDelayEMA)) + 35;
		var state = Math.floor(da / cycleLen * NCANNON) % NCANNON;
		var angle = angleUnit * state * inverter;
		if(state == 0) inverter = inverter * -1;

		var sin = Math.sin(angle);
		var cos = Math.cos(angle);

		var x = mouseX - selfX;
		var y = mouseY - selfY;
		var _x = cos * x - sin * y;
		var _y = sin * x + cos * y;
		x = _x + selfX;
		y = _y + selfY;

		artificialMouseMove = true;
		canvas.dispatchEvent(new MouseEvent("mousemove", {clientX: x, clientY: y}));
		artificialMouseMove = false;		
	}

	if(a > lastInformA + 1000){
		lastInformA = a;
		window.updateInfo && window.updateInfo("kasane_info", "発砲サイクル:" + Math.round(cycleLen, 1) + "[ms] 発砲ラグ:" + Math.round(bulletDelayEMA, 1) + "[ms]");
	}

}).toString();
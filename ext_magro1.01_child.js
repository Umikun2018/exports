(function(){///tick
	if(window.tick) return;
	window.tick = function(s){return eval(s);};

	window.getTickWorker = function(msec){
		msec = (msec || 1000);
		var workerCode = [
			'self.addEventListener("message", function(e){',
			'	var msec = e.data;',
			'	setInterval(function(){',
			'		postMessage(null);',
			'	}, msec);',
			'});'
		].join("\n");

		var blob = new Blob([workerCode], {"type": "text/javascript"});
		var url = URL.createObjectURL(blob);
		var worker = new Worker(url);
		worker.postMessage(msec);
		return worker;
	};

	window.workerSetTimeout = new (function(){
		var workerCode = (function(){
			function onMessage(e){
				var id = e.data[0];
				var msec = e.data[1];
				setTimeout(postMessage, msec, id);
			}
			self.addEventListener("message", onMessage);
		}).toString().match(/function\s*\(\)\s*{([\s\S]*)}/)[1];
		var blob = new Blob([workerCode], {"type": "text/javascript"});
		var url = URL.createObjectURL(blob);
		var worker = new Worker(url);

		var callbacks = {};
		var nextID = 1;
		this.setTimeout = function(f, delay, arg){
			if(!f) return;
			var id = nextID;
			nextID++;
			callbacks[id] = [f, arg];
			worker.postMessage([id, delay]);
			return id;
		};
		this.clearTimeout = function(id){
			if(id) delete callbacks[id];
		};
		worker.addEventListener("message", function(message){
			var id = message.data;
			if(callbacks[id]){
				callbacks[id][0](callbacks[id][1]);
				delete callbacks[id];
			}
		});
	})();


	window.tick1000 = getTickWorker(1000);
})();

(function(){////タブを表示してなくてもframe更新.
	if(window.real_requestAnimationFrame) return;

	if(!window.tick1000){
		window.console.log("auto-feed: cannot find tick1000");
		return;
	}

	var real_requestAnimationFrame = window.real_requestAnimationFrame = window.requestAnimationFrame;
	var real_cancelAnimationFrame = window.real_cancelAnimationFrame = window.cancelAnimationFrame;
	var callbacks = [];
	var N = 1000;
	var callbacksIndex = 0;
	var callbacksIndexStart = 0;
	var a_offset = null;
	window.last_a = 1;

	function replace_requestAnimationFrame(f){
		callbacks[callbacksIndex % N] = f;
		return callbacksIndex++;
	}

	function replace_cancelAnimationFrame(request){
		callbacks[request % N] = null;
	}

	function onFrame(a){
		if(a == last_a) return; 
		real_requestAnimationFrame(onFrame);
		last_a = a;

		if(a_offset == null){
			a_offset = a - (new Date()).getTime();
		}

		var start = callbacksIndexStart;
		callbacksIndexStart = callbacksIndex;
		for(var i = start; i < callbacksIndexStart; i++){
			if(callbacks[i % N]){
				try{
					callbacks[i % N](a);
				}catch(e){console.log("requestAnimationFrame error");}				
			}
		}
	}

	window.update_frame = function(){
		var time = new Date().getTime();
		var last_time = last_a - a_offset;

		if(time - last_time > 50){
			var a = time + a_offset;
			try{
				onFrame(a);
			}catch(e){}
		}
	};

	window.requestAnimationFrame = replace_requestAnimationFrame;
	window.cancelAnimationFrame = replace_cancelAnimationFrame;
	real_requestAnimationFrame(onFrame);
	tick1000.addEventListener("message", window.update_frame);
})();

(function(){
	var game_canvas = document.getElementById("game_canvas");
	var canvas_context = game_canvas.getContext("2d");
	var fillRect = canvas_context.fillRect;
	var lastUpdateA = 0;

	var gauge_color = {
		"#69a148": "health",
		"#af352a": "food",
		"#669bb1": "cold",
		"#074a87": "water"
	};

	canvas_context.fillRect = function(){
		fillRect.apply(canvas_context, arguments);

		if(window.last_a - lastUpdateA > 500 || window.last_a == lastUpdateA){
			lastUpdateA = window.last_a;
			var color = canvas_context.fillStyle;
			var gauge = gauge_color[color];
			if(gauge){
				if(gauge == "health"){
					gauges["health"] = Math.floor(200 * arguments[2] / 178);
				}else{
					gauges[gauge] = Math.floor(100 * arguments[2] / 178);
				}
			}
		}
	};
})();


(function(){
	if(window.BottleFull) return;
	window.BottleFull = true;

	var drinkFullActive = false;
	function onKeyUp(e){
		if(e.key == "B" && window.gJ && gJ.fR){
			gJ.fR.send("[7,81]");
		}else if(e.key == "P"){
			drinkFullActive = !drinkFullActive;
			if(window.updateInfo){
				window.updateInfo("drink_full", drinkFullActive ? "凝縮と飲みの繰り返し" : null);
			}
			drinkFullActive && workerSetTimeout.setTimeout(doDrink, 10);
		}
	}

	function doDrink(){
		if(drinkFullActive){
			workerSetTimeout.setTimeout(doFull, 100);
			gJ.fR.send("[5,75]");
		}
	}

	function doFull(){
		if(drinkFullActive){
			if(window.gauges.food > 25){
				workerSetTimeout.setTimeout(doDrink, 5500/3);
				window.updateInfo && window.updateInfo("drink_full", "凝縮と飲みの繰り返し");
				gJ.fR.send("[7,81]");
			}else{
				window.updateInfo && window.updateInfo("drink_full", "食料不足のため凝縮を一時停止");
				workerSetTimeout.setTimeout(doFull, 500);
			}
		}
	}
	window.addEventListener("keyup", onKeyUp);
})();
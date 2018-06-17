var export_version = 1;
var export_string = (function (a){
	window.requestAnimationFrame(onFrame);
	var da = a - lastObsTime;
	lastObsTime = a;
	frameCount++;

	var A = 0.5;
	if(game.activePlayer && frameCount % 2 == 0){
		var selfPos = game.activePlayer.pos;
		selfVX = (selfPos.x - selfX) / da * (1 - A) + selfVX * A;
		selfVY = (selfPos.y - selfY) / da * (1 - A) + selfVY * A;
		selfX = selfPos.x;
		selfY = selfPos.y;
	}

	enemies = game.playerBarn.playerPool.pool;
	//enemies = [];
	//var objs = game.objectCreator.idToObj;
	//for(var id in objs) enemies.push(objs[id]);

	if(frameCount % 2 == 0){
		var enemySVGPath = "";
		var centerX = window.innerWidth / 2;
		var centerY = window.innerHeight / 2;

		for(var ene of enemies){
			if(ene == game.activePlayer) continue;
			if(ene.active && (!ene.netData || (!ene.netData.dead && !ene.netData.downed))){
				if(!ene.posData){
					var posData = ene.posData = {x:ene.pos.x, y:ene.pos.y, vx:0, vy:0, lastTime:a};
				}else{
					var timeElapsed = a - ene.posData.lastTime;
					var posData = ene.posData;
					var pos = ene.pos;
					var vx = (pos.x - posData.x)/timeElapsed;
					var vy = (pos.y - posData.y)/timeElapsed;

					posData.x = pos.x;
					posData.y = pos.y;
					posData.vx = (posData.vx * vx < 0) ? vx : vx * (1 - A) + posData.vx * A;
					posData.vy = (posData.vy * vy < 0) ? vy : vy * (1 - A) + posData.vy * A;
					posData.lastTime = a;
				}
				var screenPos = game.camera.pointToScreen(ene.pos);
				enemySVGPath += "M " + (screenPos.x - 30) + " " + (screenPos.y - 30) + " h 60 v 60 h -60 v -60 M " +
					centerX + " " + centerY + " L " + screenPos.x + " " + screenPos.y;
			}
		}
		svgPath.setAttribute("d", enemySVGPath);	
	}


	var aimPath = "";
	if(autoAimEnabled){
		var target;
		var targetObj;
		var minDist = 1000000;

		var mousePoint = game.camera.screenToPoint({x:mouseX, y:mouseY});

		for(var ene of enemies){
			if(ene.active && ene.posData && (!ene.netData || (!ene.netData.dead && !ene.netData.downed))){
				var pos = ene.posData;
				var dist = Math.pow(mousePoint.x - pos.x, 2) + Math.pow(mousePoint.y - pos.y, 2);
				if(dist < minDist){
					minDist = dist;
					target = pos;
					targetObj = ene;
				}

			}
		}

		if(target){
			var weapType = game.activePlayer.weapType;
			var gun = gameData.items[weapType];
			var bulletSpeed;
			if(weapType == "fists"){
				bulletSpeed = 100000;
			}else{
				var bullet = gun && gun.bulletType && gameData.bullets[gun.bulletType];
				bulletSpeed = bullet && bullet.speed / 1000;				
			}
			if(bulletSpeed){
				var _delay = delay + Math.sqrt(Math.pow(selfX - target.x, 2) + Math.pow(selfY - target.y, 2)) / bulletSpeed;
				var selfPredX = selfX + selfVX * delay;
				var selfPredY = selfY + selfVY * delay;
				var targetPredX = target.x + target.vx * _delay;
				var targetPredY = target.y + target.vy * _delay;
				var aimVecX = targetPredX - selfPredX;
				var aimVecY = targetPredY - selfPredY;
				var aimX = selfX + aimVecX;
				var aimY = selfY + aimVecY;
				var aimCamera = game.camera.pointToScreen({x:aimX, y:aimY});;
				canvas.dispatchEvent(new MouseEvent("mousemove", {clientX: aimCamera.x, clientY: aimCamera.y, bubbles: true}));
				aimPath = "M " + (aimCamera.x - 30) + " " + (aimCamera.y - 30) + " h 60 v 60 h -60 v -60 ";
			}
		}
	}
	svgAimPath.setAttribute("d", aimPath);

	if(mouseDown){
		var gun = gameData.items[game.activePlayer.weapType];
		if(gun && (gun.fireMode == "single" || game.activePlayer.weapType == "fists")){
			if(frameCount % 4 == 0)canvas.dispatchEvent(mouseUpEvent);
			else if(frameCount % 6 == 1) canvas.dispatchEvent(mouseDownEvent);
		}
	}
}).toString();

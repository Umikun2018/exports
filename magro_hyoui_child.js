(function(){//sessionの操作
	if(window.possession) return;
	window.possession = true;

	var m, connection, _connection = "FT", ws = "rc", stolen = "mg", _token = "hF", _token_id = "eY";

	var container = document.createElement("div");
	container.style.position = "fixed";
	container.style["padding"] = "20px";
	container.style["color"] = "black";
	container.style["background-color"] = "white";
	container.innerHTML =
		'現在のセッション : <input type="text" readonly="" id="_current_cookie" style="width:700px" /><input type="button" value="更新" id="_current_cookie_update" /><br/>'
		+ 'セッション情報を書き換え : <input type="text" id="_overwrite_cookie" style="width:700px" /> <input type="button" id="_overwrite_cookie_execute" value="実行" /><br/>'
		+ '<input type="button" id="disconnect_button" value="プレイを中断" />';
	container.style.display = "none";
	document.body.appendChild(container);
	var _current_cookie = document.getElementById("_current_cookie");
	var _overwrite_cookie = document.getElementById("_overwrite_cookie");
	var _overwrite_cookie_execute = document.getElementById("_overwrite_cookie_execute");
	var _current_cookie_update = document.getElementById("_current_cookie_update");

	var pressing1 = false;
	var pressing0 = false;
	function onKeyDown(e){
		if(pressing1 && pressing0) return;

		if(e.key == "1") pressing1 = true;
		else if(e.key == "0") pressing0 = true;
		if(pressing1 && pressing0){
			if(container.style.display == "none"){
				container.style.display = "block";
				updateCurrentCookie();
			} else {
				container.style.display = "none";
			}
		}
	}

	function onKeyUp(e){
		if(e.key == "1") pressing1 = false;
		else if(e.key == "0") pressing0 = false;
	}

	function getTokenID(str){
		var t = str.split(" ");
		var starve_token = t[0] || "";
		var starve_token_id = t[1] || "";
		return [starve_token, starve_token_id];
	}

	function execute_overwrite_cookie(){
		var token_id = getTokenID(_overwrite_cookie.value);
		m[_token] = token_id[0];
		m[_token_id] = token_id[1];
		updateCurrentCookie();
	}

	function onDisconnectClicked(){
		connection[stolen]();	
	}

	function updateCurrentCookie(){
		var token = m[_token];
		var token_id = m[_token_id];
		_current_cookie.value = token + " " + token_id;
	}

	function init(){
		try{
			m = window.getGameVar("m");
			connection = window[_connection];
			var x = m[_token];
			x = connection.x;
			_overwrite_cookie_execute.addEventListener("click", execute_overwrite_cookie);
			_current_cookie_update.addEventListener("click", updateCurrentCookie);
			document.getElementById("disconnect_button").addEventListener("click", onDisconnectClicked);
			window.addEventListener("keydown", onKeyDown);
			window.addEventListener("keyup", onKeyUp);
			console.log("憑依 loaded");
		}catch(e){
			setTimeout(init, 5000);
			console.log("loading 憑依");
		}
	}
	init();
})();



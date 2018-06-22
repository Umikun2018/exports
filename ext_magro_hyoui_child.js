(function(){//sessionの操作

	var container = document.createElement("div");
	container.style.position = "fixed";
	container.style["padding"] = "20px";
	container.style["color"] = "black";
	container.style["background-color"] = "white";
	container.innerHTML = '現在のプレイヤーコード : <input type="text" readonly="" id="_current_cookie" style="width:700px" /><input type="button" value="最新の情報に更新" id="_current_cookie_update" /><br/>' + 
		'プレイヤーコードを書き換えてstarve.ioを再読み込み : <input type="text" id="_overwrite_cookie" style="width:700px" /> <input type="button" id="_overwrite_cookie_execute" value="実行" />';
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
		var cookie = str;
		var starve_token = "";
		var starve_token_id = "";
		var reg = /([^=;\s]+)=([^;\s]*)/g;
		var array;
		while((array = reg.exec(cookie))){
			if(array[1] == "starve_token") starve_token = array[2];
			else if(array[1] == "starve_token_id") starve_token_id = array[2];
		}
		return [starve_token, starve_token_id];
	}

	function execute_overwrite_cookie(){
		var token_id = getTokenID(_overwrite_cookie.value);
		var starve_token = "starve_token=" + token_id[0] + ";";
		var starve_token_id = "starve_token_id=" + token_id[1] + ";";
		if(window.confirm("セッションを書き換えてページを再読み込みします。")){
			document.cookie = starve_token;
			document.cookie = starve_token_id;
			window.location.href = "http://starve.io/";					
		}else{
			alert("キャンセルしました");
		}
	}

	function updateCurrentCookie(){
		var token_id = getTokenID(document.cookie);
		_current_cookie.value = "starve_token=" + token_id[0] + "; " + "starve_token_id=" + token_id[1] + ";";
	}

	_overwrite_cookie_execute.addEventListener("click", execute_overwrite_cookie);
	_current_cookie_update.addEventListener("click", updateCurrentCookie);
	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);
})();
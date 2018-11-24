function callIndex(){
	//$("[modulo]").html(plantillas["index"]);
	//setPanel();
	callRegistro();
}

function callLogout(){
	try{
		window.localStorage.removeItem("session_crm");
		window.localStorage.removeItem("session");
		
		//window.plugins.PushbotsPlugin.removeTags(["transporitsta"]);
		window.plugins.PushbotsPlugin.removeAlias();
		location.href = "index.html";
	}catch(error){
		window.localStorage.removeItem("session_crm");
		window.localStorage.removeItem("session");
		location.href = "index.html";
	}
}
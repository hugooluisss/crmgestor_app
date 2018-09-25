function callIndex(){
	$("[modulo]").html(plantillas["index"]);
	setPanel();
}

function callLogout(){
	window.localStorage.removeItem("session_crm");
	location.href = "index.html";
}
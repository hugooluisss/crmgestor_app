function callDetalleTramite(tramite){
	console.info("Llamando a detalle del tramite");
	$("#modulo").attr("modulo", "detalleTramite").html(plantillas["detalleTramite"]);
	setPanel($("#modulo"));
	$(".modal-backdrop").remove();
	
	$(".tramite").css("background-image", "url(" + server + tramite.icono + ")");
	
	setDatos($("#modulo"), tramite);
}
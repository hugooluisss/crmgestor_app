function callDetalleTramite(tramite){
	console.info("Llamando a detalle del tramite");
	$("#modulo").attr("modulo", "detalleTramite").html(plantillas["detalleTramite"]);
	setPanel($("#modulo"));
	$(".modal-backdrop").remove();
	
	$(".tramite").css("background-image", "url(" + server + tramite.icono + ")");
	
	setDatos($("#modulo"), tramite);
	$("[campo=documentacion]").find("li").remove();
	for (x in tramite.documentacion) {
		$("[documentos]").append('<li class="list-group-item">' + tramite.documentacion[x] + '</li>');
	}
}
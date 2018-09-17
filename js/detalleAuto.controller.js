function callDetalleAuto(id){
	console.info("Llamando a detalle del auto");
	$("#modulo").attr("modulo", "detalleAuto").html(plantillas["detalleAuto"]);
	setPanel($("#modulo"));
	console.info("Carga del detalle auto finalizada");
}
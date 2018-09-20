function callDetalleOrden(id){
	console.info("Llamando a detalle del auto");
	$("#modulo").attr("modulo", "detalleOrden").html(plantillas["detalleOrden"]);
	setPanel($("#modulo"));
	
	$.post(server + "cordenes", {
		"action": "getData",
		"id": id,
		"movil": true
	}, function(orden){
		setDatos($("#modulo"), orden);
		
		$("[campo=estado]").css("color", orden.colorestado);
		
		if (orden.documentacion.length == 0)
			$(".documentos").parent().parent().hide();
		
		for(i in orden.documentacion){
			doc = $(plantillas["documento"]);
			objDoc = orden.documentacion[i];
			console.log(objDoc);
			setDatos(doc, objDoc);
			$(".documentos").append(doc);
		}
	}, "json")
}
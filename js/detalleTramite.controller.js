function callDetalleTramite(tramite){
	console.info("Llamando a detalle del tramite");
	pantallas.push({"panel": "detalleTramite", "params": tramite});
	$("#modulo").attr("modulo", "detalleTramite").html(plantillas["detalleTramite"]);
	setPanel($("#modulo"));
	$(".modal-backdrop").remove();
	
	$(".tramite").css("background-image", "url(" + server + tramite.icono + ")");
	
	setDatos($("#modulo"), tramite);
	$("[campo=documentacion]").find("li").remove();
	for (x in tramite.documentacion) {
		var li = $("<li>", {
			"class": "list-group-item",
			"text": tramite.documentacion[x].nombre
		});
		
		if (tramite.documentacion[x].necesario == 1){
			li.append(' <span class="text-danger">Requerido</span>');
		}
		
		$("[documentos]").append(li);
	}
}
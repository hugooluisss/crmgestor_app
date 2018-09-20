function callOrdenes(){
	console.info("Llamando a ordenes");
	$("#modulo").attr("modulo", "ordenes").html(plantillas["ordenes"]);
	setPanel($("#modulo"));
	console.info("Carga de ordenes finalizada");
	
	getLista();
	
	function getLista(){
		$("#listaOrdenes").find("li").remove();
		$.post(server + "listaordenescliente", {
			"cliente": objUsuario.idUsuario,
			"json": true,
			"movil": true,
		}, function(ordenes){
			var pl;
			for(i in ordenes){
				pl = $(plantillas["orden"]);
				orden = ordenes[i];
				
				pl.attr("datos", orden.json);
				setDatos(pl, orden);
				
				pl.css("border-left", "3px solid " + orden.colorestado);
				pl.find("[campo=estado]").css("color", orden.colorestado);
				
				pl.attr("identificador", orden.idOrden).click(function(){
					var el = $(this);
					callDetalleOrden(el.attr("identificador"));
				});
				
				$("#listaOrdenes").append(pl);
			}
		}, "json");
	}	
}
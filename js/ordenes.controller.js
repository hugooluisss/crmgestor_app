function callOrdenes(){
	console.info("Llamando a ordenes");
	$("#tituloModulo").html("Trámites activos");
	$("#modulo").attr("modulo", "ordenes").html(plantillas["ordenes"]);
	setPanel($("#modulo"));
	console.info("Carga de ordenes finalizada");
	
	$("#modulo").find("[showpanel=autos]").click(function(){
		mensajes.alert({"mensaje": "Selecciona un vehículo para asignar el trámite", "titulo": "Nuevo trámite"});
	});
	
	getLista();
	
	function getLista(){
		$("#listaOrdenes").find("li").remove();
		$.post(server + "listaordenescliente", {
			"cliente": objUsuario.idUsuario,
			"json": true,
			"movil": true,
		}, function(ordenes){
			
			if (ordenes.length == 0){
				mensajes.alert({"titulo": "Registra un vehículo", "mensaje": "Es necesario que registres un vehículo"})
				callAutos();
			}
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
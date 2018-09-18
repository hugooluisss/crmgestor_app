function callAutos(){
	console.info("Llamando a Autos");
	$("#modulo").attr("modulo", "autos").html(plantillas["autos"]);
	setPanel($("#modulo"));
	console.info("Carga de autos finalizada");
	
	getLista();
	
	function getLista(){
		$("#listaAutos").find("li").remove();
		$.post(server + "listaautomoviles", {
			"cliente": objUsuario.idUsuario,
			"json": true,
			"movil": true,
		}, function(autos){
			var pl;
			for(i in autos){
				pl = $(plantillas["auto"]);
				
				pl.attr("datos", autos[i].json);
				setDatos(pl, autos[i]);
				
				pl.find("[action=detalle]").attr("identificador", autos[i].idAuto).click(function(){
					var el = $(this);
					callDetalleAuto(el.attr("identificador"));
				});
				
				$("#listaAutos").append(pl);
			}
		}, "json");
	}	
}
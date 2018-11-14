function callTramites(){
	console.info("Llamando a tramites");
	$("#tituloModulo").html("");
	$("#modulo").attr("modulo", "tramites").html(plantillas["tramites"]);
	pantallas.push({"panel": "tramites", "params": ""});
	setPanel($("#modulo"));
	console.info("Carga de trámites finalizada");
	
	getLista();
	
	function getLista(){
		$("#listaTramites").find("li").remove();
		$.post(server + "listatramitesapp", {
			"json": true,
			"movil": true,
		}, function(tramites){
			var pl;
			
			for(i in tramites){
				pl = $(plantillas["tramite"]);
				
				pl.attr("json", tramites[i].json);
				setDatos(pl, tramites[i]);
				pl.attr("data-target", "");
				pl.attr("data-toggle", "");
				
				pl.click(function(){
					var el = $(this);
					callDetalleTramite(JSON.parse(el.attr("json")));
				});
				
				$("#listaTramites").append(pl);
			}
		}, "json");
	}	
}
function callDetalleAuto(id){
	console.info("Llamando a detalle del auto");
	$("#modulo").attr("modulo", "detalleAuto").html(plantillas["detalleAuto"]);
	setPanel($("#modulo"));
	
	$.post(server + "cautomoviles", {
		"id": id,
		"action": "getData",
		"movil": true
	}, function(datos){
		setDatos($("#modulo"), datos);
	}, "json");
	
	
	$("#frmVehiculo").validate({
		debug: true,
		errorClass: "validateError",
		rules: {
			txtModelo: {
				required : true
			},
			txtMarca: {
				required : true
			},
			txtAnio: {
				required : true
			}
		},
		wrapper: 'span',
		submitHandler: function(form){
			form = $(form);
			
			var obj = new TAutomovil;
			obj.add({
				id: form.find("#id").val(),
				modelo: form.find("#txtModelo").val(),
				anio: form.find("#txtAnio").val(),
				marca: form.find("#txtMarca").val(),
				fn: {
					before: function(){
						form.find("[type=submit]").prop("disabled", true);
					}, after: function(resp){
						form.find("[type=submit]").prop("disabled", false);
						
						if(resp.band)
							mensajes.alert({"titulo": "Datos guardados", mensaje: "Gracias, hemos actualizados los datos"});
						else
							mensajes.alert({"titulo": "Error", mensaje: "No se pudo registrar los datos"});
					}
				}
			});
		}
	});
	
	console.info("Carga del detalle auto finalizada");
	
	
	$.post(server + "listatramites", {
		"movil": true,
		"json": true
	}, function(tramites){
		var pl;
		for(i in tramites){
			pl = $(plantillas["tramite"]);
			
			pl.attr("datos", tramites[i].json);
			setDatos(pl, tramites[i]);
			if (tramites[i].icono != undefined || tramites[i].icono != '')
				pl.find(".icono").attr("src", server + tramites[i].icono);
			
			pl.attr("datos", tramites[i].json);
			
			$("#listaTramites").append(pl);
		}
	}, "json");
	
	
	$("#winTramite").on('show.bs.modal', function(e){
		var tramite = JSON.parse($(e.relatedTarget).attr("datos"));
		$("#winTramite").find("[campo]").show();
		
		setDatos($("#winTramite"), tramite);
		
		if (tramite.color != null)
			$("#winTramite").find(".modal-header").css("background", tramite.color).css("color", "white");
		else
			$("#winTramite").find(".modal-header").css("background", "white").css("color", "black");
		
		if (tramite.documentacion == null)
			$("#winTramite").find("[campo=documentacion]").hide();
			
		$("#winTramite").find("#btnSolicitar").attr("datos", $(e.relatedTarget).attr("datos"));
	});
}
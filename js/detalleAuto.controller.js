function callDetalleAuto(id){
	console.info("Llamando a detalle del auto");
	$("#modulo").attr("modulo", "detalleAuto").html(plantillas["detalleAuto"]);
	setPanel($("#modulo"));
	idCarro = id;
	
	var d = new Date();
	fin = d.getFullYear() + 10;
	
	for(anio = d.getFullYear() ; anio < fin ; anio++)
		$(".exp_year").append($('<option value="' + anio + '">' + anio + '</option>'));
	
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
	
	
	$.post(server + "listatramitesapp", {
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
		$("#winTramite").attr("datos", $(e.relatedTarget).attr("datos"));
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
	
	$("#winPago").on('show.bs.modal', function(e){
		var tramite = JSON.parse($("#winTramite").attr("datos"));
		$("#winPago").find("#submitPago").html("Pagar $ " + tramite.precio + " ahora");
		
		$(".name").val("hugo Santiago");
		$(".number").val("4242424242424242");
		$(".cvc").val("121");
		$(".exp_month").val("11");
		$(".exp_year").val("2018");
	});
	
	$("#winPago").find("#submitPago").click(function(){
		var $form = $("#frmPago");
		Conekta.setPublicKey(publicConekta);
		Conekta.setLanguage("es"); 
		var tramite = JSON.parse($("#winTramite").attr("datos"));

		$("#winPago").find("#submitPago").prop("disabled", true);
		blockUI("Estamos procesando el pago");
		Conekta.Token.create($form, function(token){
			$("#conektaTokenId").val(token.id);
			
			$.post(server + 'cpagos', {
				"token": token.id,
				"cliente": objUsuario.idUsuario,
				"tramite": tramite.idTramite,
				"movil": 1,
				"action": "addPagoConekta"
			}, function(resp){
				$form.find("button").prop("disabled", false);
				
				if (resp.band){
					var orden = new TOrden;
					orden.add({
						"cliente": objUsuario.idUsuario,
						"tramite": tramite.idTramite,
						"carro": idCarro,
						"observaciones": "",
						"action": "add",
						"fn": {
							before: function(){
								$form.find("button").prop("disabled", true);
							}, after: function(resp){
								$form.find("button").prop("disabled", false);
								unBlockUI();

								if (resp.band){
									$("#winPago").modal("hide");
									$("#winTramite").modal("hide");
									
									if (tramite.cita == 0){
										callPanel("home");
										mensajes.alert({"titulo": "Registro completo", "mensaje": "Muchas gracias por su pago..."});
									}else{
										$("#winCita").modal();
										$("#winCita").attr("orden", resp.id);
										$("#winCita").attr("duracion", tramite.duracion);
										
										mensajes.alert({"titulo": "Registro completo", "mensaje": "Necesitamos que reserves una cita"});
									}
								}else
									mensajes.alert({"titulo": "Error", "mensaje": "No se pudo procesar el pago"});
							}
						}
					});
				}else{
					mensajes.alert({"titulo": "Error", "mensaje": "No pudo ser procesado el pago"});
					unBlockUI();
				}
			}, "json");

		}, function(response) {
			var $form = $("#frmEnvio");
			unBlockUI();
			/* Muestra los errores en la forma */
			mensajes.alert({"titulo": "Conekta", "mensaje": response.message_to_purchaser});
			$form.find("button").prop("disabled", false);
			
			unBlockUI();
		});
	});
}
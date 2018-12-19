function callDetalleAuto(id){
	console.info("Llamando a detalle del auto");
	pantallas.push({"panel": "detalleAuto", "params": id});
	$("#modulo").attr("modulo", "detalleAuto").html(plantillas["detalleAuto"]);
	setPanel($("#modulo"));
	$(".modal-backdrop").remove();
	idCarro = id;
	vehiculo = undefined;
	
	var d = new Date();
	fin = d.getFullYear() + 10;
	
	for(anio = d.getFullYear() ; anio < fin ; anio++)
		$(".exp_year").append($('<option value="' + anio + '">' + anio + '</option>'));
		
	d = new Date;
	fin = d.getFullYear() + ((d.getMonth() > 3)?1:0);
	console.log(fin);
	for(anio = 1980 ; anio <= fin ; anio++){
		$("#selModelo").prepend($("<option />", {
			value: anio,
			text: anio
		}));
	}
	
	$("#selModelo").val(d.getFullYear());
	
	$("#txtVence").datetimepicker({
		format: "Y-m-d",
		timepicker: false,
		inline: true
	});
	
	$.post(server + "cautomoviles", {
		"id": id,
		"action": "getData",
		"movil": true
	}, function(datos){
		vehiculo = datos;
		setDatos($("#modulo"), datos);
	}, "json");
	
	console.info("Carga del detalle auto finalizada");
	
	$("#btnEliminar").click(function(){
		var el = $(this);
		mensajes.confirm({"titulo": "Eliminar", "mensaje": "¿Seguro de querer borrar?", "botones": "Si,No", "funcion": function(resp){
			if (resp == 1){
				var obj = new TAutomovil;
				obj.del({
					"id": idCarro,
					"fn": {
						after: function(resp){
							if (resp.band){
								mensajes.log({"mensaje": "Vehículo borrado"});
								callAutos();
							}else
								mensajes.alert({"titulo": "Error", "mensaje": "No se pudo borrar el registro"});
						}
					}
				});
			}
		}});
	});
	
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
				required : true,
				number: true
			},
			txtVence: "required"
		},
		wrapper: 'span',
		submitHandler: function(form){
			form = $(form);
			
			var obj = new TAutomovil;
			obj.add({
				id: form.find("#idAuto").val(),
				marca: form.find("#txtMarca").val(), 
				submarca: form.find("#txtSubMarca").val(), 
				modelo: form.find("#selModelo").val(),
				serie: form.find("#txtSerie").val(),
				motor: form.find("#txtMotor").val(), 
				placa: form.find("#txtPlaca").val(), 
				holograma: form.find("#selHolograma").val(), 
				vence: form.find("#txtVence").val(),
				cliente: objUsuario.idUsuario,
				fn: {
					before: function(){
						form.find("[type=submit]").prop("disabled", true);
					}, after: function(resp){
						form.find("[type=submit]").prop("disabled", false);
						
						if(resp.band){
							mensajes.log({mensaje: "Los datos del vehículo se actualizaron"});
							$('#winDetalleAuto').modal("hide");
							callDetalleAuto(id);
						}else
							mensajes.alert({"titulo": "Error", mensaje: "No se pudo registrar los datos"});
					}
				}
			});
		}
	});
	
	/*
	$.post(server + "listatramitesapp", {
		"movil": true,
		"json": true
	}, function(tramites){
		//var pl;
		$.each(tramites, function(i, tramite){
			var pl = $(plantillas["tramite"]);
			
			pl.attr("datos", tramites[i].json);
			setDatos(pl, tramites[i]);
			if (tramites[i].icono != undefined && tramites[i].icono != '')
				pl.css("background-image", "url(" + server + tramites[i].icono + ")");
			
			pl.attr("datos", tramites[i].json);
			
			$("#listaTramites").append(pl);
			pl.click(function(){
				$("#winTramite").attr("datos", tramites[i].json);
				$("#winTramite").modal();
			});
		});
	}, "json");
	*/
	
	
	
	$("#winTramite").on('show.bs.modal', function(e){
		//var tramite = JSON.parse($(e.relatedTarget).attr("datos"));
		$("#winTramite").attr("datos", $("#winTramite").attr("datos"));
		var tramite = JSON.parse($("#winTramite").attr("datos"));
		$("#winTramite").find("[campo]").show();
		
		setDatos($("#winTramite"), tramite);
		s = '';
		for(i in tramite.documentacion){
			s += (s != ''?", ":"") + tramite.documentacion[i].nombre;
		}
		$("#winTramite").find("[campo=documentacion]").text(s);
		if (tramite.documentacion == null || tramite.documentacion == undefined || tramite.documentacion == '')
			$("#winTramite").find("[campo=documentacion]").hide();
			
		if (tramite.icono != undefined && tramite.icono != ''){
			$("#winTramite").find(".icono").attr("src", server + tramite.icono);
		}else{
			$("#winTramite").find(".icono").attr("src", "img/logoSinNombre.png");
		}
			
		$("#winTramite").find("#btnSolicitar").attr("datos", $(e.relatedTarget).attr("datos"));
	});
	
	
	$("#btnSolicitar").click(function(){
		var tramite = JSON.parse($("#winTramite").attr("datos"));
		$("#winTramite").modal("hide");
		$(".modal-backdrop").remove();
		callSolicitar(tramite, vehiculo);
	});
	
	/*
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
									
									callDetalleOrden(resp.id);
									mensajes.alert({"titulo": "Registro completo", "mensaje": "Gracias por su pago... lo enviaremos al panel de de su trámite para completar el registro de datos"});
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
			mensajes.alert({"titulo": "Conekta", "mensaje": response.message_to_purchaser});
			$form.find("button").prop("disabled", false);
			
			unBlockUI();
		});
	});
	
	*/
}
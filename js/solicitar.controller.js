function callSolicitar(tramite, vehiculo){
	pantallas.push({"panel": "solicitar", "params": tramite, "params2": vehiculo});
	
	var fotos = [];
	var documentoActual = "";
	console.log(tramite, vehiculo);
	console.info("Llamando a Solicitar");
	$("#tituloModulo").html("Solicitar trámite");
	$("#modulo").attr("modulo", "solicitar").html(plantillas["solicitar"]);
	setPanel($("#modulo"));
	console.info("Carga finalizada");
	bandCita = false;
	/*
	//$("#panelCita").hide();
	permissions = cordova.plugins.permissions;
	console.log(permissions.CAMERA);
	permissions.checkPermission(permissions.CAMERA, function(status){
		if ( status.hasPermission )
			console.log("Yes :D ");
		else{
			console.warn("No :( ");
			permissions.requestPermission(permissions.CAMERA, function(status){
				console.log(status);
				if(!status.hasPermission)
					mensajes.alert({"titulo": "Camara", "mensaje": "Tu dispositivo no dió acceso a la cámara"});
				
			}, function(){
				mensajes.alert({"titulo": "Camara", "mensaje": "Tu dispositivo no dió acceso a la cámara"});
			});
		}
	});
	*/
	setDatos($("#modulo"), tramite);
	$(".tramite").css("background-image", "url(" + server + tramite.icono + ")");
	jQuery.datetimepicker.setLocale('es');
	
	var d = new Date();
	fin = d.getFullYear() + 10;
	
	for(anio = d.getFullYear() ; anio < fin ; anio++)
		$(".exp_year").append($('<option value="' + anio + '">' + anio + '</option>'));
	
	cont = 0;
	$.each(tramite.documentacion, function(i, documento){
	//for(i in tramite.documentacion){
		var doc = $(plantillas["documento"]);
		var objDoc = tramite.documentacion[i];
		
		setDatos(doc, objDoc);
		if (objDoc != ''){
			cont++;
			console.info(objDoc);
			
			fotos[objDoc.nombre] = [];
			
			$(".documentos").append(doc);
			doc.find("[campo=nombre]").text(objDoc.nombre);
			doc.attr("nombre", objDoc.nombre);
			doc.click(function(){
				$("#winFotos").attr("nombre", objDoc.nombre);
				$("#winFotos").modal();
			});
			
			if (objDoc.necesario == 0) doc.find(".requerido").hide();
		}
	});
	
	if(tramite.documentacion.length == 0){
		$("#documentacion").remove();
		$("#documentacion-tab").parent().remove();
	}
	
	if (tramite.cita == 0){
		$("#cita").remove();
		$("#cita-tab").parent().remove();
		
		bandCita = 1;
	}else{
		d = new Date;
		$(".direccionEnvio").hide();
		$.post(server + "cvariables", {
			"id": "horarios",
			"action": "getVariable",
			"movil": true,
		}, function(resp){
			var horarios = resp.valor.split(",");
			var defHorarios = [];
			for (i in horarios){
				defHorarios.push(horarios[i].trim());
			}
			$("#txtFechaCita").datetimepicker({
				format: "Y-m-d H:i",
				allowTimes:defHorarios,
				defaultTime: horarios[0],
				timepickerOptions: {
					defaultTime: '8:00'
				},
				onChangeDateTime: function(){
					$.post(server + "cordenes", {
						"action": "verificarCita",
						"fecha": $("#txtFechaCita").val(),
						"movil": true
					}, function(resp){
						if (!resp.band){
							mensajes.alert({"mensaje": "Ya tenemos una cita reservada en ese horario, intenta en otro", "titulo": "Horario ocupado"});
							$("#txtFechaCita").val("");
						}
						
						bandCita = resp.band;
					}, "json");
				}
			});
		},"json");
	}
	
	$('#tabsServicio li:first-child a').tab('show');
	$("#btnNextOfDocumentos").click(function(){
		if (tramite.cita == 1)
			$('#tabsServicio a[href=#cita]').tab('show');
		else
			$('#tabsServicio a[href=#confirmar]').tab('show');
	});
	
	$("#btnNextOfCita").click(function(){
		$('#tabsServicio a[href=#confirmar]').tab('show');
	});
	
	
	$("#btnPagar").click(function(){
		var band = true;
		var bandDoc = true;
		for (i in tramite.documentacion){
			if (tramite.documentacion[i].necesario == 1 && fotos[tramite.documentacion[i].nombre].length == 0)
				bandDoc = false;
		}
		
		
		if (!bandDoc){
			band = false;
			mensajes.log({"mensaje": "Agrega las fotografías de tu documentación"});
			$('#tabsServicio a[href="#documentacion"]').tab('show');
		}
		
		if (band && tramite.cita == 1 && ($("#txtFechaCita").val() == '' || !bandCita)){
			band = false;
			mensajes.log({"mensaje": "Indica la fecha para agendar tu cita"});
			//$('#tabsServicio li:first-child a').tab('show');
			$('#tabsServicio a[href="#cita"]').tab('show');
			$("#txtFechaCita").focus();
		}
		/*
		if (band && tramite.cita && $("#txtComentarioCita").val() == ''){
			band = false;
			mensajes.log({"mensaje": "Escribe un comentario para el gestor"});
			$('#tabsServicio a[href="#cita"]').tab('show');
			$("#txtComentarioCita").focus();
		}
		*/
		if (band && tramite.cita == 1 && $("#txtDireccionCita").val() == ''){
			band = false;
			mensajes.log({"mensaje": "Indícanos la dirección donde nos reuniremos"});
			$('#tabsServicio a[href="#cita"]').tab('show');
			$("#txtDireccionCita").focus();
		}
		
		if (band && tramite.cita == 0 && $("#txtDireccion").val() == ''){
			band = false;
			mensajes.log({"mensaje": "Indícanos la dirección donde te entregaremos tus documentos"});
			$('#tabsServicio a[href="#confirmar"]').tab('show');
			$("#txtDireccion").focus();
		}
		
		if (band){
			$("#winPago").modal();
		}
		
		
		console.log(band);
	});
	
	$("#winPago").on('show.bs.modal', function(e){
		//var tramite = JSON.parse($("#winTramite").attr("datos"));
		$("#winPago").find("#submitPago").html("Pagar $ " + tramite.precio + " ahora");
		/*
		$(".name").val("hugo Santiago");
		$(".number").val("4242424242424242");
		$(".cvc").val("121");
		$(".exp_month").val("11");
		$(".exp_year").val("2018");
		*/
	});
	
	$("#winPago").find("#submitPago").click(function(){
		var $form = $("#frmPago");
		Conekta.setPublicKey(publicConekta);
		Conekta.setLanguage("es"); 
		//var tramite = JSON.parse($("#winTramite").attr("datos"));

		$("#winPago").find("#submitPago").prop("disabled", true);
		blockUI("Estamos procesando el pago");
		Conekta.Token.create($form, function(token){
			$("#conektaTokenId").val(token.id);
			console.log("Enviando para token");
			unBlockUI();
			$.post(server + 'cpagos', {
				"token": token.id,
				"cliente": objUsuario.idUsuario,
				"tramite": tramite.idTramite,
				"movil": 1,
				"action": "addPagoConekta"
			}, function(resp){
				$form.find("button").prop("disabled", false);
				blockUI("Estamos procesando el pago");
				if (resp.band){
					var cita = new Array;
					cita['fecha'] = $("#txtFechaCita").val();
					cita['comentario'] = $("#txtComentarioCita").val();
					cita['direccion'] = $("#txtDireccionCita").val();
					
					console.log(cita);
					var orden = new TOrden;
					orden.add({
						"cliente": objUsuario.idUsuario,
						"tramite": tramite.idTramite,
						"carro": vehiculo.idAuto,
						"observaciones": $("#txtComentarios").val(),
						"direccion": $("#txtDireccion").val(),
						"cita": cita,
						"imagenes": fotos,
						"direccion": $("#txtDireccion").val(),
						"fn": {
							before: function(){
								$form.find("button").prop("disabled", true); 
							}, after: function(resp){
								$form.find("button").prop("disabled", false);
								unBlockUI();

								if (resp.band){
									$("#winPago").modal("hide");
									$("#winTramite").modal("hide");
									orden.sendMail({
										"id": resp.id,
										"cita": resp.cita,
										fn: {
											before: function(){
												blockUI("Actualizando información en el servidor");
											},
											after: function(resp){
												unBlockUI();
												
												callAutos();
												mensajes.alert({"titulo": "Registro completo", "mensaje": "Listo, te mantendremos informado sobre el avance de tu servicio"});
											}
										}
									});
								}else
									mensajes.alert({"titulo": "Error", "mensaje": resp.mensaje});
							}
						}
					});
				}else{
					mensajes.alert({"titulo": "Error", "mensaje": resp.mensaje == ''?"No se pudo procesar el pago":resp.mensaje});
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
	
	$("#btnAtras").click(function(){
		callDetalleAuto(vehiculo.idAuto);
	});
	
	
	
	$('#winFotos').on('show.bs.modal', function(e){
		var el = $("#winFotos");
		documentoActual = el.attr("nombre");
		console.log(fotos[documentoActual]);
		$('#winFotos').find("[campo=documento]").text(documentoActual);
		$("#winFotos").find(".imagenes").find("img").remove();
		
		for(i in fotos[documentoActual]){
			code = fotos[documentoActual][i];
			
			addObjImg(code);
		}
	});
	
	$('#winFotos').on('hide.bs.modal', function(e){
		$("li.documento").each(function(){
			var el = $(this);
			if (fotos[el.attr("nombre")].length > 0)
				el.attr("add", 1);
			else
				el.attr("add", 0);
		});
		
		console.log("Fotos");
	});
	
	$("#btnCamara").click(function(){
		navigator.camera.getPicture(function(imageURI){
			agregarFoto(imageURI);
		}, function(message){
			alertify.error("Ocurrio un error al obtener la imagen " + message);
		}, {
			quality: 90,
			destinationType: Camera.DestinationType.DATA_URL,
			encodingType: 0,
			targetWidth: 600,
			targetHeight: 600,
			correctOrientation: false,
			allowEdit: false,
			saveToPhotoAlbum: false
		});
	});
	
	$("#btnGaleria").click(function(){
		navigator.camera.getPicture(function(imageURI){
			agregarFoto(imageURI);
		}, function(message){
			alertify.error("Ocurrio un error al obtener la imagen " + message);
		}, {
			quality: 90,
			destinationType: Camera.DestinationType.DATA_URL,
			encodingType: Camera.EncodingType.JPEG,
			targetWidth: 600,
			targetHeight: 600,
			correctOrientation: false,
			allowEdit: false,
			sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
		});
	});
	
	function addObjImg(codigo){
		var img = $("<img />", {
			src: "data:image/jpeg;base64," + codigo,
			"indice": fotos[documentoActual].length - 1
		});
		
		$("#winFotos").find(".imagenes").append(img);
		
		img.click(function(){
			var el = $(this);
			fotos[documentoActual].splice(fotos[documentoActual].indexOf(el.attr("indice")), 1);
			img.remove();
			
			console.log(fotos[documentoActual]);
		});
		
		console.log(fotos[documentoActual]);
	}
	
	function agregarFoto(imageURI){
		//blockUI();
		//var img = el.parent().parent();
		fotos[documentoActual].push(imageURI);
		addObjImg(imageURI);
		
		//img.css("background-image", "url(data:image/jpeg;base64," + imageURI + ")");
		//img.attr("src2", imageURI);
		//img.attr("add", 1);
		//img.attr("fotos", img.attr("fotos") + 1);
		//if ($(".imgDoc[add=0]").length == 0 && tramite.cita == 1)
		//	$("#panelCita").show();
	}
}
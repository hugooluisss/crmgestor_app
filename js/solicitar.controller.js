function callSolicitar(tramite, vehiculo){
	var fotos = [];
	var documentoActual = "";
	console.log(tramite, vehiculo);
	console.info("Llamando a Solicitar");
	$("#tituloModulo").html("Solicitar trámite");
	$("#modulo").attr("modulo", "solicitar").html(plantillas["solicitar"]);
	setPanel($("#modulo"));
	console.info("Carga finalizada");
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
	$("#txtFechaCita").datetimepicker({
		format: "Y-m-d H:i",
		step: 30
	});
	
	var d = new Date();
	fin = d.getFullYear() + 10;
	
	for(anio = d.getFullYear() ; anio < fin ; anio++)
		$(".exp_year").append($('<option value="' + anio + '">' + anio + '</option>'));
	
	cont = 0;
	for(i in tramite.documentacion){
		doc = $(plantillas["documento"]);
		objDoc = tramite.documentacion[i];
		
		setDatos(doc, objDoc);
		if (objDoc != ''){
			cont++;
			console.info(objDoc);
			
			fotos[objDoc.nombre] = [];
			
			$(".documentos").append(doc);
			doc.find("[campo=nombre]").text(objDoc.nombre);
			doc.attr("nombre", objDoc.nombre);
		}
	}
	console.info(fotos);
	if(cont == 0){
		$("#documentacion").remove();
		$("#documentacion-tab").parent().remove();
	}
	
	if (tramite.cita == 0){
		$("#cita").remove();
		$("#cita-tab").parent().remove();
	}
	
	$('#tabsServicio li:first-child a').tab('show');
	
	
	$("#btnPagar").click(function(){
		var band = true;
		if ($("[add=0]").length > 0){
			band = false;
			mensajes.log({"mensaje": "Agrega las fotografías de tu documentación"});
			$('#tabsServicio a[href="#documentacion"]').tab('show');
		}
		
		if (band && tramite.cita && $("#txtFechaCita").val() == ''){
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
		if (band && tramite.cita && $("#txtDireccion").val() == ''){
			band = false;
			mensajes.log({"mensaje": "Indícanos la dirección donde nos reuniremos"});
			$('#tabsServicio a[href="#cita"]').tab('show');
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
		//var tramite = JSON.parse($("#winTramite").attr("datos"));

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
					var data = new FormData();
					data.append("total", $("[add=1]").length);
					i = 0;
					$("[add=1]").each(function(){
						data.append("img" + i, $(this).attr("src2"));
						data.append("name" + i++, $(this).attr("nombre"));
						//data.append("imagen" + i, $(this).attr("src2"));
						//data.append("nombre" + i, $(this).attr("nombre"));
					});
					
					var cita = new Array;
					cita['fecha'] = $("#txtFechaCita").val();
					cita['comentario'] = $("#txtComentarioCita").val();
					
					console.log(cita);
					var orden = new TOrden;
					orden.add({
						"cliente": objUsuario.idUsuario,
						"tramite": tramite.idTramite,
						"carro": vehiculo.idAuto,
						"observaciones": $("#txtComentarios").val(),
						"imagenes": data,
						"cita": cita,
						"imagenes": $("[add=1]"),
						"direccion": $("#txtDireccion").val(),
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
	
	$("#btnAtras").click(function(){
		callDetalleAuto(vehiculo.idAuto);
	});
	
	
	
	$('#winFotos').on('show.bs.modal', function(e){
		var el = $(e.relatedTarget);
		documentoActual = el.attr("nombre");
		console.log(fotos[documentoActual]);
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
			quality: 100,
			destinationType: Camera.DestinationType.DATA_URL,
			encodingType: Camera.EncodingType.JPEG,
			targetWidth: 600,
			targetHeight: 600,
			correctOrientation: false,
			allowEdit: false,
			sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM
		});
	});
	
	function agregarFoto(imageURI){
		//blockUI();
		//var img = el.parent().parent();
		fotos[documentoActual].push(imageURI);
		var img = $("<img />", {
			src: "data:image/jpeg;base64," + imageURI,
			"indice": fotos[documentoActual].length - 1
		});
		
		$("#winFotos").find(".imagenes").append(img);
		
		img.click(function(){
			var el = $(this);
			fotos[documentoActual].splice(fotos[documentoActual].indexOf(el.attr("indice")), 1);
			
			console.log(fotos[documentoActual]);
		});
		
		console.log(fotos[documentoActual]);
		
		//img.css("background-image", "url(data:image/jpeg;base64," + imageURI + ")");
		//img.attr("src2", imageURI);
		//img.attr("add", 1);
		//img.attr("fotos", img.attr("fotos") + 1);
		//if ($(".imgDoc[add=0]").length == 0 && tramite.cita == 1)
		//	$("#panelCita").show();
	}
}
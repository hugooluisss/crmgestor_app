function callSolicitar(tramite, vehiculo){
	console.log(tramite, vehiculo);
	console.info("Llamando a Solicitar");
	$("#tituloModulo").html("Solicitar trámite");
	$("#modulo").attr("modulo", "solicitar").html(plantillas["solicitar"]);
	setPanel($("#modulo"));
	console.info("Carga finalizada");
	
	//$("#panelCita").hide();
	
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
		if (objDoc != ''){
			cont++;
			console.info(objDoc);
			//doc.find("img").attr("src", objDoc.archivo == ''?'img/documento.png':(server + objDoc.archivo + "?" + Math.floor((Math.random() * 10000) + 1)));
			
			$(".documentos").append(doc);
			doc.find("[campo=nombre]").text(objDoc);
			doc.find("img").attr("nombre", objDoc);
			doc.find(".btnCamara").attr("documento", objDoc);
			doc.find(".btnCamara").click(function(){
				var el = $(this);
				navigator.camera.getPicture(function(imageURI){
					agregarFoto(imageURI, el);
				}, function(message){
					alertify.error("Ocurrio un error al obtener la imagen");
				}, {
					quality: 100,
					destinationType: Camera.DestinationType.DATA_URL,
					encodingType: Camera.EncodingType.JPEG,
					targetWidth: 800,
					targetHeight: 800,
					correctOrientation: true,
					allowEdit: false,
					saveToPhotoAlbum: true
				});
			});
			
			doc.find(".btnGaleria").attr("documento", objDoc);
			doc.find(".btnGaleria").click(function(){
				var el = $(this);
				navigator.camera.getPicture(function(imageURI){
					agregarFoto(imageURI, el);
				}, function(message){
					alertify.error("Ocurrio un error al obtener la imagen");
				}, {
					quality: 100,
					destinationType: Camera.DestinationType.DATA_URL,
					encodingType: Camera.EncodingType.JPEG,
					targetWidth: 800,
					targetHeight: 800,
					correctOrientation: true,
					allowEdit: false,
					sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM
				});
			});
		}
	}
	
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
		if ($(".imgDoc[add=0]").length > 1){
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
		
		if (band && tramite.cita && $("#txtComentarioCita").val() == ''){
			band = false;
			mensajes.log({"mensaje": "Escribe un comentario para el gestor"});
			$('#tabsServicio a[href="#cita"]').tab('show');
			$("#txtComentarioCita").focus();
		}
		
		if (band){
			$("#winPago").modal();
		}
		
		
		console.log(band);
	});
	
	function agregarFoto(imageURI, el){
		//blockUI();
		var img = el.parent().parent();
		
		img.css("background", "data:image/jpeg;base64," + imageURI);
		img.attr("src2", imageURI);
		img.attr("add", 1);
		if ($(".imgDoc[add=0]").length == 0 && tramite.cita == 1)
			$("#panelCita").show();
	}
	
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
					
					var fotografias = new Array;
					for(i = 0 ; i < 10 ; i++){
						fotografias[i] = new Array;
						fotografias[i]['code'] = "";
						fotografias[i]['nombre'] = "";
					}
					i = 0;
					$(".imgDoc[add=1]").each(function(){
						fotografias[i]['code'] = $(this).attr("src2");
						fotografias[i]['nombre'] = $(this).attr("nombre");
						i++;
					});
					//console.log(fotografias);
					
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
						"imagenes": fotografias,
						"cita": cita,
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
									
									callAutos();
									mensajes.alert({"titulo": "Registro completo", "mensaje": "Listo, te mantendremos informado sobre el avance de tu servicio"});
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
}
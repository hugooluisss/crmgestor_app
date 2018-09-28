function callDetalleOrden(id){
	console.info("Llamando a detalle del auto");
	$("#modulo").attr("modulo", "detalleOrden").html(plantillas["detalleOrden"]);
	setPanel($("#modulo"));
	var idOrden = id;
	var ultimaLectura = undefined;
	var ciclo;
	var totalDoc = 0;
	
	$("#txtFechaCita").datetimepicker({
		format: "Y-m-d H:i",
		step: 30
	});

	
	$.post(server + "cordenes", {
		"action": "getData",
		"id": id,
		"movil": true
	}, function(orden){
		setDatos($("#modulo"), orden);
		console.log(orden);
		$("[campo=estado]").css("color", orden.colorestado);
		
		if (orden.documentacion.length == 0)
			$(".documentos").parent().parent().hide();
		
		if (orden.gestor != undefined)
			$("#dvGestor").html('<small class="text-muted"><b>Gestor: </b>' + orden.gestor.nombre + '</small>');
		
		bandDoc = true;
		totalDoc = 0;
		for(i in orden.documentacion){
			doc = $(plantillas["documento"]);
			objDoc = orden.documentacion[i];
			
			doc.find("img").attr("src", objDoc.archivo == ''?'img/documento.png':(server + objDoc.archivo + "?" + Math.floor((Math.random() * 10000) + 1)));
			setDatos(doc, objDoc);
			$(".documentos").append(doc);
			
			doc.find(".btnCamara").attr("documento", objDoc.nombre);
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
			
			doc.find(".btnGaleria").attr("documento", doc.nombre);
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
			
			bandDoc = bandDoc && objDoc.archivo != '';
			totalDoc += objDoc.archivo != ''?1:0;
		}
		
		setViewDocumentos(orden);
		
		$("#frmAddCita").validate({
			debug: true,
			errorClass: "validateError",
			rules: {
				txtFechaCita: {
					required : true
				}
			},
			wrapper: 'span',
			submitHandler: function(form){
				form = $(form);
				
				var obj = new TCita;
				obj.add({
					orden: idOrden,
					fecha: form.find("#txtFechaCita").val(),
					descripcion: form.find("#txtDescripcion").val(),
					fn: {
						before: function(){
							form.find("[type=submit]").prop("disabled", true);
						}, after: function(resp){
							form.find("[type=submit]").prop("disabled", false);
							
							if(resp.band){
								mensajes.alert({"titulo": "Datos guardados", mensaje: "Tu cita fue agregada, nuestro gestor te informará si está disponible ese día y hora"});
								callDetalleOrden(idOrden);
							}else
								mensajes.alert({"titulo": "Error", mensaje: "No pudo ser registrada tu cita"});
						}
					}
				});
			}
		});
		
		$("#btnSendMsg").click(function(){
			sendMensaje();
		});
		
		$("#txtMensaje").keypress(function(e){
			if(e.which == 13)
				sendMensaje();
		});
		
		getMensajes();
		
		ciclo = setInterval(getMensajes, 2000);
	}, "json");
	
	$("[showpanel=ordenes]").click(function(){
		clearInterval(ciclo);
	});
	
	function sendMensaje(){
		var obj = new TMensaje;
		obj.send({
			"orden": idOrden,
			"mensaje": $("#txtMensaje").val(),
			fn: {
				before: function(){
					$("#btnSendMsg").prop("disabled", true);
					$("#txtMensaje").prop("disabled", true);
				}, after: function(resp){
					$("#btnSendMsg").prop("disabled", false);
					$("#txtMensaje").prop("disabled", false).val("");
						
					if (resp.band){
						$("#txtMensaje").val("");
					}else
						mensajes.alert({"title": "Error", "mensaje": "No se pudo enviar tu mensaje"});
				}
			}
		});
	}
	
	function getMensajes(){
		var d = new Date;
		if ($("#dvConversacion").length == 0)
			clearInterval(ciclo);
		
		$.post(server + "cordenes", {
			"orden": idOrden,
			"action": "getMensajes",
			"ultimaConsulta": ultimaLectura,
			"movil": true
		}, function(mensajes){
			for(i in mensajes){
				mensaje = mensajes[i];
				ultimaLectura = mensaje.fecha;
				var pl = $(plantillas["mensaje"]);
				setDatos(pl, mensaje);
				
				pl.addClass(mensaje.emisor == 'C'?"text-left":"text-right");
				pl.addClass(mensaje.emisor == 'C'?"":"offset-1");
				
				$("#dvConversacion").append(pl);
				$("#dvConversacion").animate({ scrollTop: $('#dvConversacion')[0].scrollHeight}, 10);
			}
		}, "json");
	}
	
	
	function agregarFoto(imageURI, el){
		blockUI();
		var img = el.parent().find("img");
	
		img.attr("src", "data:image/jpeg;base64," + imageURI);
		img.attr("src2", imageURI);
		
		$.post(server + "cordenes", {
			"img": imageURI, //"data:image/jpeg;base64," + imageURI,
			"nombre": el.attr("documento"),
			"orden": idOrden,
			"action": "uploadDocumento",
			"json": true,
			"movil": true
		}, function(resp){
			unBlockUI();
			if (resp.band){
				mensajes.log({"mensaje": "Documento actualizado"});
				totalDoc++;
			}else
				mensajes.alert({"titulo": "Error", "mensaje": "No se pudo actualizar el documento"});
		}, "json")
	}
	
	function setViewDocumentos(orden){
		if (orden.cita == 1 && totalDoc >= orden.documentacion.length){
			$(".cita").parent().parent().show();
			if (orden.citas.length == 0){
				$(".cita").parent().parent().show();
				$(".proximaCita").hide();
			}else{
				$(".proximaCita").show();
				setDatos($(".proximaCita"), orden.citas[0]);
				$(".cita").parent().parent().hide();
			}
		}else{
			$(".cita").parent().parent().hide();
			$(".proximaCita").hide();
		}
	}
}
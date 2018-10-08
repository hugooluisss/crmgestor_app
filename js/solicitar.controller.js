function callSolicitar(tramite){
	console.log(tramite);
	console.info("Llamando a Solicitar");
	$("#tituloModulo").html("Solicitar trámite");
	$("#modulo").attr("modulo", "solicitar").html(plantillas["solicitar"]);
	setPanel($("#modulo"));
	console.info("Carga finalizada");
	
	$("#panelCita").hide();
	
	setDatos($("#modulo"), tramite);
	$(".tramite").css("background-image", "url(" + server + tramite.icono + ")");
	jQuery.datetimepicker.setLocale('es');
	$("#txtFechaCita").datetimepicker({
		format: "Y-m-d H:i",
		step: 30
	});
	
	for(i in tramite.documentacion){
		doc = $(plantillas["documento"]);
		objDoc = tramite.documentacion[i];
		console.info(objDoc);
		//doc.find("img").attr("src", objDoc.archivo == ''?'img/documento.png':(server + objDoc.archivo + "?" + Math.floor((Math.random() * 10000) + 1)));
		
		$(".documentos").append(doc);
		doc.find("[campo=nombre]").text(objDoc);
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
	
	$("#btnPagar").click(function(){
		var band = true;
		if ($(".imgDoc[add=0]").length > 1){
			band = false;
			mensajes.log({"mensaje": "Agrega las fotografías de tu documentación"});
		}
		
		if (band && tramite.cita && $("#txtFecha").val() == ''){
			band = false;
			mensajes.log({"mensaje": "Indica la fecha para agendar tu cita"});
			$("#txtFecha").select();
		}
		
		if (band && tramite.cita && $("#txtComentarios").val() == ''){
			band = false;
			mensajes.log({"mensaje": "Escribe un comentario para el gestor"});
			$("#txtComentario").select();
		}
		
		console.log(band);
	});
	
	function agregarFoto(imageURI, el){
		//blockUI();
		var img = el.parent().find("img");
	
		img.attr("src", "data:image/jpeg;base64," + imageURI);
		img.attr("src2", imageURI);
		img.attr("add", 1);
		if ($(".imgDoc[add=1]").length == 0 && tramite.cita == 1)
			$("#panelCita").show();
	}
}
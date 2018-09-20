function callDetalleOrden(id){
	console.info("Llamando a detalle del auto");
	$("#modulo").attr("modulo", "detalleOrden").html(plantillas["detalleOrden"]);
	setPanel($("#modulo"));
	var idOrden = id;
	var ultimaLectura = undefined;
	var ciclo;
	
	$.post(server + "cordenes", {
		"action": "getData",
		"id": id,
		"movil": true
	}, function(orden){
		setDatos($("#modulo"), orden);
		
		$("[campo=estado]").css("color", orden.colorestado);
		
		if (orden.documentacion.length == 0)
			$(".documentos").parent().parent().hide();
		
		for(i in orden.documentacion){
			doc = $(plantillas["documento"]);
			objDoc = orden.documentacion[i];
			console.log(objDoc);
			setDatos(doc, objDoc);
			$(".documentos").append(doc);
		}
		
		$("#btnSendMsg").click(function(){f
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
		
		$.post(server + "cordenes", {
			"orden": idOrden,
			"action": "getMensajes",
			"ultimaConsulta": ultimaLectura,
			"movil": true
		}, function(mensajes){
			console.log(mensajes);
			for(i in mensajes){
				mensaje = mensajes[i];
				ultimaLectura = mensaje.fecha;
				var pl = $(plantillas["mensaje"]);
				setDatos(pl, mensaje);
				
				pl.addClass(mensaje.emisor == 'C'?"text-left":"text-right");
				
				$("#dvConversacion").append(pl);
				
				$("#dvConversacion").animate({ scrollTop: $('#dvConversacion')[0].scrollHeight}, 10);
			}
		}, "json");
	}
}
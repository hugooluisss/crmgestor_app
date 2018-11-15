TOrden = function(){
	var self = this;
	/*
	this.add = function(datos){
		if (datos.fn.before !== undefined) datos.fn.before();
		
		datos.imagenes.append("tramite", datos.tramite);
		datos.imagenes.append("cliente", datos.cliente);
		datos.imagenes.append("carro", datos.carro);
		datos.imagenes.append("citaFecha", datos.cita['fecha']);
		datos.imagenes.append("citaComentario", datos.cita['comentario']);
		datos.imagenes.append("direccion", datos.direccion);
		datos.imagenes.append("observaciones", datos.observaciones);
		datos.imagenes.append("movil", true);
		datos.imagenes.append("action", "add");
		
		console.log(datos.imagenes);
		
		$.ajax({
			url: server + 'cordenes',
			data: datos.imagenes,
			processData: false,
			contentType: "multipart/form-data",
			cahe: false,
			type: 'POST',
			method: 'POST',
			success: function(data){
				data = jQuery.parseJSON(data);
				if (data.band == false)
					console.log("No se guardó el registro");
					
				if (datos.fn.after !== undefined)
					datos.fn.after(data);
			}
		});
	}*/
	
	this.add = function(datos){
		if (datos.fn.before !== undefined) datos.fn.before();
		
		$.post(server + 'cordenes', {
				"id": datos.id,
				"cliente": datos.cliente,
				"tramite": datos.tramite,
				"observaciones": datos.observaciones,
				"carro": datos.carro,
				"action": "add",
				"citaFecha": datos.cita['fecha'],
				"citaComentario": datos.cita['comentario'],
				"citaDireccion": datos.cita['direccion'],
				"direccion": datos.direccion,
				"movil": true
			}, function(resp){
				if (resp.band == false)
					console.log("No se guardó el registro");
				contAjax = 0;
				
				for(i in datos.imagenes){
					cont = 0;
					contAjax++;
					for(ii in datos.imagenes[i]){
						cont++;
						var data = new FormData();
						data.append("img", datos.imagenes[i][ii]);
						data.append("name", i);
						data.append("indice", cont);
						data.append("movil", true);
						data.append("action", "uploadDocumentoApp");
						data.append("orden", resp.id);
						//data.append("cita", resp.cita);
						
						$.ajax({
							url: server + 'cordenes',
							"data": data,
							processData: false,
							cahe: false,
							type: 'POST',
							method: 'POST',
							contentType: false,
							success: function(data){
								data = jQuery.parseJSON(data);
								if (data.band == false)
									console.log("No se guardó la imagen");
							}
						});
					}
				}
				
				temporizador = setInterval(function(){
					if (contAjax >= datos.imagenes.length){
						clearInterval(temporizador);
						if (datos.fn.after !== undefined)
							datos.fn.after(resp);
					}
				},5000);
			}, "json");
	};
	
	this.sendMail = function(datos){
		if (datos.fn.before !== undefined) datos.fn.before();
		$.post(server + 'cordenes', {
			"id": datos.id,
			"cita": datos.cita,
			"action": "sendMail",
			"movil": true
		}, function(data){
			if (datos.fn.after !== undefined)
				datos.fn.after(data);
					
			if (data.band == false){
				console.log("Ocurrió un error al eliminar");
			}
		}, "json");
	}
	
	this.del = function(datos){
		if (datos.fn.before !== undefined) datos.fn.before();
		$.post(server + 'cordenes', {
			"id": datos.id,
			"action": "del",
			"movil": true
		}, function(data){
			if (datos.fn.after !== undefined)
				datos.fn.after(data);
					
			if (data.band == false){
				console.log("Ocurrió un error al eliminar");
			}
		}, "json");
	};
};
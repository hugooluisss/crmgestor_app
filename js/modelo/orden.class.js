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
				"direccion": datos.direccion,
				"movil": true
			}, function(resp){
				if (resp.band == false)
					console.log("No se guardó el registro");
				conAjax = 0;
				
				$.each(datos.imagenes, function(i, img){
					contAjax++;
					var data = new FormData();
					data.append("img", $(img).attr("src2"));
					data.append("name", $(img).attr("nombre"));
					data.append("movil", true);
					data.append("action", "uploadDocumentoApp");
					data.append("orden", resp.id);
					
					$.ajax({
						url: server + 'cordenes',
						"data": data,
						processData: false,
						cahe: false,
						type: 'POST',
						method: 'POST',
						success: function(data){
							data = jQuery.parseJSON(data);
							if (data.band == false)
								console.log("No se guardó la imagen");
								
							contAjax--;
						}
					});
				});
				
				while(contAjax != 0){
					alert("Listo");
				}
				
				if (datos.fn.after !== undefined)
					datos.fn.after(data);
			}, "json");
	};
	
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
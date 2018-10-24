TOrden = function(){
	var self = this;
	
	this.add = function(datos){
		if (datos.fn.before !== undefined) datos.fn.before();
		
		campos.append("citaFecha", datos.cita['fecha']);
		campos.append("citaComentario", datos.cita['comentario']);
		campos.append("direccion", datos.direccion);
		campos.append("movil", true);
		
		
		$.ajax({
			url: server + 'cordenes',
			data: campos,
			processData: false,
			contentType: false,
			type: 'POST',
			success: function(data){
				data = jQuery.parseJSON(data);
				if (data.band == false)
					console.log("No se guardó el registro");
					
				if (datos.fn.after !== undefined)
					datos.fn.after(data);
			}
		});
	}
	/*
	this.add = function(datos){
		if (datos.fn.before !== undefined) datos.fn.before();
		
		$.post(server + 'cordenes', {
				"id": datos.id,
				"cliente": datos.cliente,
				"tramite": datos.tramite,
				"observaciones": datos.observaciones,
				"carro": datos.carro,
				"action": "add",
				"imagen0": datos.imagenes[0]['code'],
				"imagen1": datos.imagenes[1]['code'],
				"imagen2": datos.imagenes[2]['code'],
				"imagen3": datos.imagenes[3]['code'],
				"imagen4": datos.imagenes[4]['code'],
				"imagen5": datos.imagenes[5]['code'],
				"imagen6": datos.imagenes[6]['code'],
				"imagen7": datos.imagenes[7]['code'],
				"imagen8": datos.imagenes[8]['code'],
				"imagen9": datos.imagenes[9]['code'],
				"imagen10": datos.imagenes[0]['code'],
				"imagen11": datos.imagenes[1]['code'],
				"imagen12": datos.imagenes[2]['code'],
				"imagen13": datos.imagenes[3]['code'],
				"imagen14": datos.imagenes[4]['code'],
				"imagen15": datos.imagenes[5]['code'],
				"imagen16": datos.imagenes[6]['code'],
				"imagen17": datos.imagenes[7]['code'],
				"imagen18": datos.imagenes[8]['code'],
				"imagen19": datos.imagenes[9]['code'],
				"imagen20": datos.imagenes[0]['code'],
				"imagen21": datos.imagenes[1]['code'],
				"imagen22": datos.imagenes[2]['code'],
				"imagen23": datos.imagenes[3]['code'],
				"imagen24": datos.imagenes[4]['code'],
				"imagen25": datos.imagenes[5]['code'],
				"imagen26": datos.imagenes[6]['code'],
				"imagen27": datos.imagenes[7]['code'],
				"imagen28": datos.imagenes[8]['code'],
				"imagen29": datos.imagenes[9]['code'],
				
				"nombre0": datos.imagenes[0]['nombre'],
				"nombre1": datos.imagenes[1]['nombre'],
				"nombre2": datos.imagenes[2]['nombre'],
				"nombre3": datos.imagenes[3]['nombre'],
				"nombre4": datos.imagenes[4]['nombre'],
				"nombre5": datos.imagenes[5]['nombre'],
				"nombre6": datos.imagenes[6]['nombre'],
				"nombre7": datos.imagenes[7]['nombre'],
				"nombre8": datos.imagenes[8]['nombre'],
				"nombre9": datos.imagenes[9]['nombre'],
				"nombre10": datos.imagenes[0]['nombre'],
				"nombre11": datos.imagenes[1]['nombre'],
				"nombre12": datos.imagenes[2]['nombre'],
				"nombre13": datos.imagenes[3]['nombre'],
				"nombre14": datos.imagenes[4]['nombre'],
				"nombre15": datos.imagenes[5]['nombre'],
				"nombre16": datos.imagenes[6]['nombre'],
				"nombre17": datos.imagenes[7]['nombre'],
				"nombre18": datos.imagenes[8]['nombre'],
				"nombre19": datos.imagenes[9]['nombre'],
				"nombre20": datos.imagenes[0]['nombre'],
				"nombre21": datos.imagenes[1]['nombre'],
				"nombre22": datos.imagenes[2]['nombre'],
				"nombre23": datos.imagenes[3]['nombre'],
				"nombre24": datos.imagenes[4]['nombre'],
				"nombre25": datos.imagenes[5]['nombre'],
				"nombre26": datos.imagenes[6]['nombre'],
				"nombre27": datos.imagenes[7]['nombre'],
				"nombre28": datos.imagenes[8]['nombre'],
				"nombre29": datos.imagenes[9]['nombre'],
				
				"citaFecha": datos.cita['fecha'],
				"citaComentario": datos.cita['comentario'],
				"direccion": datos.direccion,
				"movil": true
			}, function(data){
				if (data.band == false)
					console.log("No se guardó el registro");
					
				if (datos.fn.after !== undefined)
					datos.fn.after(data);
			}, "json");
	};*/
	
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
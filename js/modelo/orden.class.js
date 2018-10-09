TOrden = function(){
	var self = this;
	
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
				"citaFecha": datos.cita['fecha'],
				"citaComentario": datos.cita['comentario'],
				"movil": true
			}, function(data){
				if (data.band == false)
					console.log("No se guardó el registro");
					
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
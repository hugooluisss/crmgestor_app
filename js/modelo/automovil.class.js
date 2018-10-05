TAutomovil = function(){
	var self = this;
	
	this.add = function(datos){
		if (datos.fn.before !== undefined) datos.fn.before();
		
		$.post(server + 'cautomoviles', {
				"id": datos.id,
				"cliente": datos.cliente,
				"marca": datos.marca,
				"submarca": datos.submarca,
				"modelo": datos.modelo,
				"motor": datos.motor,
				"placa": datos.placa,
				"holograma": datos.holograma,
				"serie": datos.serie,
				"vence": datos.vence,
				"movil": true,
				"action": "add"
			}, function(data){
				if (data.band == false)
					console.log("No se guardó el registro");
					
				if (datos.fn.after !== undefined)
					datos.fn.after(data);
			}, "json");
	};
	
	this.del = function(datos){
		if (datos.fn.before !== undefined) datos.fn.before();
		$.post(server + 'cautomoviles', {
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
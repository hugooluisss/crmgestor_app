TMensaje = function(){
	var self = this;
	
	this.send = function(datos){
		if (datos.fn.before !== undefined) datos.fn.before();
		
		$.post(server + 'cordenes', {
				"orden": datos.orden,
				"mensaje": datos.mensaje,
				"action": "addMensaje",
				"movil": true
			}, function(data){
				if (data.band == false)
					console.log("No se guardó el registro");
					
				if (datos.fn.after !== undefined)
					datos.fn.after(data);
			}, "json");
	};
};
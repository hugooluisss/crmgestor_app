TUsuario = function(chofer){
	var self = this;
	self.idUsuario = window.localStorage.getItem("session_crm");
	self.datos = {};
	
	this.isLogin = function(){
		if (self.idUsuario == '' || self.idUsuario == undefined || self.idUsuario == null) return false;
		if (self.idUsuario != window.localStorage.getItem("session_crm")) return false;
		
		return true;
	};
	
	this.login = function(datos){
		if (datos.fn.before !== undefined) datos.fn.before();
		
		$.post(server + 'clogin', {
			"usuario": datos.usuario,
			"pass": datos.pass, 
			"action": 'logintransportista',
			"movil": 'true'
		}, function(resp){
			if (resp.band == false)
				console.log(resp.mensaje);
			else{
				window.localStorage.setItem("session_crm", resp.datos.usuario);
				self.idTransportista = resp.datos.idTransportista;
			}
				
			if (datos.fn.after !== undefined)
				datos.fn.after(resp);
		}, "json");
	};
	
	this.getData = function(datos){
		if (datos.fn.before !== undefined) datos.fn.before();
		
		var usuario = datos.idUsuario == undefined?self.idUsuario:datos.idUsuario;
		
		$.post(server + 'ctransportistas', {
			"id": usuario,
			"action": 'getData',
			"movil": true
		}, function(resp){
			self.datos = resp;
			self.imagenPerfil = self.datos.imagenPerfil;
			if (datos.fn.after !== undefined)
				datos.fn.after(resp);
		}, "json");
	}
	
	this.recuperarPass = function(correo, fn){
		if (fn.before !== undefined) fn.before();
		
		$.post(server + 'cusuarios', {
				"correo": correo,
				"action": 'recuperarPass',
				"movil": '1'
			}, function(data){
				if (data.band == false)
					console.log(data.mensaje);
					
				if (fn.after !== undefined)
					fn.after(data);
			}, "json");
	};
	
	this.add = function(datos){
		if (datos.fn.before !== undefined) datos.fn.before();
		
		$.post(server + 'ctransportistas', {
				"id": datos.id,
				"razonSocial": datos.razonSocial,
				"tipoCamion": datos.tipoCamion,
				"representante": datos.email, 
				"rut": datos.rut,
				"patente": datos.patente,
				"correo": datos.correo,
				"pass": datos.pass,
				"calificacion": datos.calificacion,
				"aprobado": datos.aprobado,
				"situacion": datos.situacion,
				"telefono": datos.telefono,
				"action": "add",
				"movil": true
			}, function(data){
				if (data.band == false)
					console.log("No se guardó el registro");
					
				if (datos.fn.after !== undefined)
					datos.fn.after(data);
			}, "json");
	};
};
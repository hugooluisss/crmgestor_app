server = "http://dashboard.nomastenencias.com/";
//server = "http://192.168.2.2/crm_gestor/";
//server = "http://localhost/crm_gestor/";

var idUsuario = undefined;
var publicConekta = "key_Zqr2ZkSGqeYMdaraabxVHww";
/*
*
* Centra verticalmente una ventana modal
*
*/
function reposition(modal, dialog) {
	modal.css('display', 'block');
	
	// Dividing by two centers the modal exactly, but dividing by three 
	// or four works better for larger screens.
	dialog.css("margin-top", Math.max(0, ($(window).height() - dialog.height()) / 2));
}

function checkConnection() {
	try{
		var networkState = navigator.connection.type;
	
		var states = {};
		states[Connection.UNKNOWN]  = 'Unknown connection';
		states[Connection.ETHERNET] = 'Ethernet connection';
		states[Connection.WIFI]     = 'WiFi connection';
		states[Connection.CELL_2G]  = 'Cell 2G connection';
		states[Connection.CELL_3G]  = 'Cell 3G connection';
		states[Connection.CELL_4G]  = 'Cell 4G connection';
		states[Connection.CELL]     = 'Cell generic connection';
		states[Connection.NONE]     = 'No network connection';
		
		switch(networkState){
			case Connection.NONE: 
				alertify.error("Verifica tu conexión, la aplicación necesita conexión a internet");
				return false;
			break;
			default:
				return true;
		}
	}catch(e){
		return true;
	}
}

function getDistancia(lat1, lon1, lat2, lon2){
	rad = function(x) {return x*Math.PI/180;}
	
	var R = 6378.137;
	var dLat = rad(lat2 - lat1);
	var dLong = rad(lon2 - lon1);
	
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c;
	
	return d.toFixed(3); //Retorna tres decimales
}

var mensajes = {
	alert: function(data){
		if (data.funcion == undefined)
			data.funcion = function(){};
			
		if (data.titulo == undefined)
			data.titulo = " ";
		
		try{
			navigator.notification.alert(data.mensaje, data.funcion, data.titulo, data.boton);
		}catch(err){
			window.alert(data.mensaje);
		}

	},
	
	confirm: function(data){
		if (data.funcion == undefined)
			data.funcion = function(){};
			
		if (data.titulo == undefined)
			data.titulo = " ";
		
		
		try{
			navigator.notification.confirm(data.mensaje, data.funcion, data.titulo, data.botones);
		}catch(err){
			if (confirm(data.mensaje))
				data.funcion(1);
			else
				data.funcion(2);
		}
	},
	
	log: function(data){
		alertify.log(data.mensaje);
	},
	
	prompt: function(data){
		if (data.funcion == undefined)
			data.funcion = function(){};
			
		if (data.titulo == undefined)
			data.titulo = " ";
		
		
		try{
			navigator.notification.prompt(data.mensaje, data.funcion, data.titulo, data.botones);
		}catch(err){
			var result = prompt(data.mensaje);
			data.funcion({
				buttonIndex: 1,
				input1: result
			});
		}
	},
};

function setDatos(plantilla, datos){
	$.each(datos, function(i, valor){
		antes = plantilla.find("[campo=" + i + "]").attr("before") || ""; 
		despues = plantilla.find("[campo=" + i + "]").attr("after") || ""; 
		valorText =  antes + valor + despues;
		plantilla.find("[campo=" + i + "]").each(function(){
			var el = $(this);
			if (el.is("select") || el.is("input") || el.is("textarea")){
				el.val(valor);
			}else{
				el.html(valorText);
			}
		});
	});
}

function setPanel(el){
	if (el == undefined)
		el = $("body");
		
	el.find("[showpanel]").click(function(){
		callPanel($(this).attr("showpanel"));
	});
}

function getPlantillas(after){
	var cont = 0;
	$.each(plantillas, function(){
		cont++;
	});
	
	$.each(plantillas, function(pl, valor){
		$.get("vistas/" + pl + ".html", function(html){
			plantillas[pl] = html;
			
			cont--;
			if (cont == 0)
				after();
		});
	});
};


function activarNotificaciones(fn){
	window.plugins.PushbotsPlugin.initialize("5bcf96b469b5ee396a35300b", {
		"android":{
			"sender_id":"580777664404",
			"icon": "icon",
			"iconColor": "#FFFFFF"
		}
	});
	
	//window.plugins.PushbotsPlugin.debug(true);
	
	window.plugins.PushbotsPlugin.resetBadge();
	window.plugins.PushbotsPlugin.toggleNotifications(true);
	window.plugins.PushbotsPlugin.setAlias("usuario_" + objUsuario.idUsuario);
	
	if (fn.after !== undefined)
		fn.after();
}
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var objUsuario = null;
var plantillas = {};
var pantallas = [];

var app = {
	// Application Constructor
	initialize: function() {
		this.bindEvents();
	},
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents: function(){
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	// deviceready Event Handler
	//
	// The scope of 'this' is the event. In order to call the 'receivedEvent'
	// function, we must explicitly call 'app.receivedEvent(...);'
	onDeviceReady: function() {
		activarNotificaciones({
			fn: {
				after: function(){
					// Should be called once app receive the notification only while the application is open or in background
					window.plugins.PushbotsPlugin.on("notification:received", function(data){
						console.log("received:", data);
						var datos = JSON.stringify(data);
						window.plugins.PushbotsPlugin.resetBadge();
						
						//Silent notifications Only [iOS only]
						//Send CompletionHandler signal with PushBots notification Id
						window.plugins.PushbotsPlugin.done(data.pb_n_id);
						if (data.aps.alert != '')
							alertify.success(data.aps.alert);
							
						window.plugins.PushbotsPlugin.resetBadge();
					});
					
					// Should be called once the notification is clicked
					window.plugins.PushbotsPlugin.on("notification:clicked", function(data){
						console.log("clicked:" + JSON.stringify(data));
						if (data.message != undefined)
							alertify.success(data.message);
							
						window.plugins.PushbotsPlugin.resetBadge();
					});
					
					//window.plugins.PushbotsPlugin.debug(true);
					// Should be called once the device is registered successfully with Apple or Google servers
					window.plugins.PushbotsPlugin.on("registered", function(token){
						console.log("Token de registro", token);
						window.plugins.PushbotsPlugin.setAlias("usuario_" + objUsuario.idUsuario);
						alertify.success("Usuario en linea");
					});
					
					//Get device token
					window.plugins.PushbotsPlugin.getRegistrationId(function(token){
					    console.log("Registration Id:" + token);
					});	
					
					window.plugins.PushbotsPlugin.on("user:ids", function (data) {
						console.log("user:ids" + JSON.stringify(data));
						// userToken = data.token; 
						// userId = data.userId
					});
				}
			}
		});
		
		document.addEventListener("backbutton", function(){
			if (pantallas[pantallas.length-1].panel == 'autos'){
				mensajes.confirm({"titulo": "Salir", "mensaje": "¿Seguro de salir?", "botones": ["Salir", "Cancelar"], "funcion": function(resp){
					if (resp == 1)
						callLogout();
				}});
			}else{
				pantallas.pop();
				var el = pantallas[pantallas.length-1];
				$(".modal-backdrop").remove();
				switch(el.panel){
					case 'autos': 
						console.log("reiniciado");
						callAutos(); 
					break;
					case 'detalleAuto': callDetalleAuto(el.params); break;
					case 'detalleTramite': callDetalleTramite(el.params); break;
					case 'solicitar': callSolicitar(el.params, el.params2); break;
					case 'tramites': callTramites(); break;
				}
				pantallas.pop();
			}
			
		}, false);
	}
};

app.initialize();

$(document).ready(function(){
	objUsuario = new TUsuario;
	if (!objUsuario.isLogin())
		location.href = "index.html";
		
	
	plantillas["home"] = "";
	plantillas["autos"] = "";
	plantillas["auto"] = "";
	plantillas["detalleAuto"] = "";
	plantillas["tramite"] = "";
	plantillas["solicitar"] = "";
	plantillas["documento"] = "";
	plantillas["tramites"] = "";
	plantillas["detalleTramite"] = "";
	plantillas["perfil"] = "";
	/*
	plantillas["ordenes"] = "";
	plantillas["orden"] = "";
	plantillas["detalleOrden"] = "";
	plantillas["documento"] = "";
	plantillas["mensaje"] = "";
	*/
	setPanel();
	
	getPlantillas(function(){
		callPanel("autos");
	});
	
	//app.onDeviceReady();
});

function callPanel(panel){
	$("#navbarSupportedContent").removeClass("show");
	switch(panel){
		case 'home':
			callHome();
		break;
		case 'autos':
			callAutos();
		break;
		case 'ordenes':
			callOrdenes();
		break;
		case 'tramites':
			callTramites();
		break;
		case 'perfil':
			callPerfil();
		break;
		case 'logout':
			callLogout();
		break;
		default:
			console.info("Panel no encontrado");
	}
}
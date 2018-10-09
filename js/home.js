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
var app = {
	// Application Constructor
	initialize: function() {
		this.bindEvents();
	},
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	// deviceready Event Handler
	//
	// The scope of 'this' is the event. In order to call the 'receivedEvent'
	// function, we must explicitly call 'app.receivedEvent(...);'
	onDeviceReady: function() {
		//activarNotificaciones();
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
		case 'logout':
			callLogout();
		break;
		default:
			console.info("Panel no encontrado");
	}
}
function callPerfil(){
	console.info("Llamando a perfil");
	$("#tituloModulo").html("");
	$("#modulo").attr("modulo", "perfil").html(plantillas["perfil"]);
	pantallas.push({"panel": "perfil", "params": ""});
	setPanel($("#modulo"));
	console.info("Carga de perfil finalizada");
	
	objUsuario.getData({
		fn: {
			before: function(){
				blockUI("Estamos obteniendo tus datos");
			},
			after: function(resp){
				unBlockUI();
				setDatos($("#modulo"), resp);
			}
		}
	});
	
	
	$("#frmRegistro").validate({
		debug: true,
		errorClass: "validateError",
		rules: {
			txtCorreo: {
				required: true,
				email: true,
				"remote": {
					url: server + "cclientes",
					type: "post",
					data: {
						"action": "validarCorreo",
						"correo": function(){
							return $("#txtCorreo").val()
						},
						"id": objUsuario.idUsuario,
						"movil": "true"
					}
				}
			},
			txtTelefono: {
				required: true
			},
			txtNombre: {
				required: true
			},
			txtPass: {
				equalTo: "#txtPass2"
			}
		},
		messages: {
			"txtCorreo": {
				"remote": "El correo ya se encuentra registrado con otro usuario"
			},
			"txtPass":{
				"equalTo": "Las contraseñas no coinciden"
			}
		},
		wrapper: 'span',
		submitHandler: function(form){
			var obj = new TUsuario;
			form = $(form);
			obj.add({
				correo: form.find("#txtCorreo").val(), 
				pass: form.find("#txtPass").val(),
				telefono: form.find("#txtTelefono").val(),
				nombre: form.find("#txtNombre").val(),
				id: objUsuario.idUsuario,
				fn: {
					before: function(){
						form.find("[type=submit]").prop("disabled", true);
					},
					after: function(data){
						form.find("[type=submit]").prop("disabled", false);
						if (data.band == false){
							mensajes.alert({
								"mensaje": "Los datos no se actualizaron",
								"titulo": "Registro"
							});
						}else{
							$("#txtPass").val("");
							$("#txtPass2").val("");
							mensajes.log({
								"mensaje": "Tus datos se actualizaron"
							});
						}
					}
				}
			});
		}
	});
}
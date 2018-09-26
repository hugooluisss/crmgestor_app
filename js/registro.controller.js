function callRegistro(){
	$("[modulo]").html(plantillas["registro"]);
	setPanel();
	
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
				required : true
			}
		},
		messages: {
			"txtCorreo": {
				"remote": "El correo ya se encuentra registrado"
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
				aprobado: 0,
				fn: {
					before: function(){
						form.find("[type=submit]").prop("disabled", true);
					},
					after: function(data){
						if (data.band == false){
							mensajes.alert({
								"mensaje": "No pudimos registrar tu cuenta",
								"titulo": "Registro"
							});
							form.find("[type=submit]").prop("disabled", false);
						}else{
							mensajes.log({
								"mensaje": "Te hemos enviado un correo para verificar tu cuenta. Verificala para poder ingresar con tus datos"
							});
							callIndex();
						}
					}
				}
			});
		}
	});
}
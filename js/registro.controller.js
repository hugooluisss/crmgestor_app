function callRegistro(){
	$("[modulo]").html(plantillas["registro"]);
	setPanel();
	
	$.get("https://www.nomastenencias.com/terminos-y-condiciones/", function(resp){
		var cod = $(resp);
		$("#winTerminos").find(".modal-body").html(cod.find("#main-content").find(".entry-content").html());
	})
	
	$("#chkTerminos").click(function(){
		var btn = $(this);
		console.log(btn);
		if (btn.is(":checked"))
			$("#winTerminos").modal();
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
			if (!$("#chkTerminos").is(":checked"))
				mensajes.alert({"titulo": "Terminos y condiciones", "mensaje": "Es necesario que aceptes los términos y condiciones del servicio"});
			else{
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
							form.find("[type=submit]").prop("disabled", false);
							if (data.band == false){
								mensajes.alert({
									"mensaje": "No pudimos registrar tu cuenta",
									"titulo": "Registro"
								});
							}else{
								mensajes.log({
									"mensaje": "Muchas gracias, tu registro está completo... ahora puedes iniciar sesión"
								});
								callPanel("login");
							}
						}
					}
				});
			}
		}
	});
}
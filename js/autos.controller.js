function callAutos(){
	console.info("Llamando a Autos");
	$("#tituloModulo").html("Mis Automóviles");
	$("#modulo").attr("modulo", "autos").html(plantillas["autos"]);
	setPanel($("#modulo"));
	console.info("Carga de autos finalizada");
	
	getLista();
	
	function getLista(){
		$("#listaAutos").find("li").remove();
		$.post(server + "listaautomoviles", {
			"cliente": objUsuario.idUsuario,
			"json": true,
			"movil": true,
		}, function(autos){
			var pl;
			for(i in autos){
				pl = $(plantillas["auto"]);
				
				pl.attr("datos", autos[i].json);
				setDatos(pl, autos[i]);
				
				pl.find("[action=detalle]").attr("identificador", autos[i].idAuto).click(function(){
					var el = $(this);
					callDetalleAuto(el.attr("identificador"));
				});
				
				pl.find("[action=eliminar]").attr("identificador", autos[i].idAuto).click(function(){
					var el = $(this);
					mensajes.confirm({"titulo": "Eliminar", "mensaje": "¿Seguro de querer borrar?", "botones": "Si,No", "funcion": function(resp){
						if (resp == 1){
							var obj = new TAutomovil;
							obj.del({
								"id": el.attr("identificador"),
								"fn": {
									after: function(resp){
										if (resp.band)
											getLista();
										else
											mensajes.alert({"titulo": "Error", "mensaje": "No se pudo borrar el registro"});
									}
								}
							});
						}
					}});
				});
				
				$("#listaAutos").append(pl);
			}
		}, "json");
	}
	
	$('#winDetalleAuto').on('shown.bs.modal', function(e){
		try{
			$("#txtMarca").val("");
			$("#txtModelo").val("");
			$("#txtAnio").val("");
			$("#idAuto").val("");
		}catch(e){
			console.log(e);
		}
		
	});
	
	$("#frmVehiculo").validate({
		debug: true,
		errorClass: "validateError",
		rules: {
			txtModelo: {
				required : true
			},
			txtMarca: {
				required : true
			},
			txtAnio: {
				required : true,
				number: true
			}
		},
		wrapper: 'span',
		submitHandler: function(form){
			form = $(form);
			
			var obj = new TAutomovil;
			obj.add({
				id: form.find("#idAuto").val(),
				modelo: form.find("#txtModelo").val(),
				anio: form.find("#txtAnio").val(),
				marca: form.find("#txtMarca").val(),
				cliente: objUsuario.idUsuario,
				fn: {
					before: function(){
						form.find("[type=submit]").prop("disabled", true);
					}, after: function(resp){
						form.find("[type=submit]").prop("disabled", false);
						
						if(resp.band){
							$('#winDetalleAuto').modal("hide");
							mensajes.alert({"titulo": "Registro completo", mensaje: "Tu vehículo quedó registrado en nuestro sistema"});
							callDetalleAuto(resp.id);
						}else
							mensajes.alert({"titulo": "Error", mensaje: "No se pudo registrar los datos"});
					}
				}
			});
		}
	});

}
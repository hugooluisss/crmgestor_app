function callAutos(){
	for(i in pantallas)
		pantallas.pop();
	pantallas.push({"panel": "autos", "params": ""});
	console.info("Llamando a Autos");
	$("#tituloModulo").html("Mis Automóviles");
	$("#modulo").attr("modulo", "autos").html(plantillas["autos"]);
	setPanel($("#modulo"));
	console.info("Carga de autos finalizada");
	
	d = new Date;
	
	for(anio = 1980 ; anio <= d.getFullYear() ; anio++){
		$("#selModelo").prepend($("<option />", {
			value: anio,
			text: anio
		}));
	}
	
	$("#selModelo").val(d.getFullYear());
	
	$("#txtVence").datetimepicker({
		format: "Y-m-d",
		timepicker: false
	});
	
	getLista();
	
	function getLista(){
		$("#listaAutos").find("li").remove();
		$.post(server + "listaautomoviles", {
			"cliente": objUsuario.idUsuario,
			"json": true,
			"movil": true,
		}, function(autos){
			var pl;
			
			if (autos.length == 0)
				$("#panelSinCarros").show();
			
			for(i in autos){
				pl = $(plantillas["auto"]);
				
				pl.attr("datos", autos[i].json);
				setDatos(pl, autos[i]);
				
				pl.attr("identificador", autos[i].idAuto).click(function(){
					var el = $(this);
					callDetalleAuto(el.attr("identificador"));
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
			},
			txtVence: "required"
		},
		wrapper: 'span',
		submitHandler: function(form){
			form = $(form);
			
			var obj = new TAutomovil;
			obj.add({
				id: form.find("#idAuto").val(),
				marca: $("#txtMarca").val(), 
				submarca: $("#txtSubMarca").val(), 
				modelo: $("#selModelo").val(),
				serie: $("#txtSerie").val(),
				motor: $("#txtMotor").val(), 
				placa: $("#txtPlaca").val(), 
				holograma: $("#selHolograma").val(), 
				vence: $("#txtVence").val(),
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
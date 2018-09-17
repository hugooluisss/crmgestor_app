function callAutos(){
	console.info("Llamando a Autos");
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
				
				$("#listaAutos").append(pl);
			}
		}, "json");
	}
	
	
	$('#winDetalleAuto').on('shown.bs.modal', function(e){
		var btn = $(e.relatedTarget);
		
		try{
			auto = JSON.parse(btn.parent().parent().attr("datos"));
			$("#txtMarca").val(auto.marca);
			$("#txtModelo").val(auto.modelo);
			$("#txtAnio").val(auto.anio);
			$("#idAuto").val(auto.idAuto);
		}catch(e){
			console.log(e);
			$('#winDetalleAuto').modal("hide");
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
				required : true
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
				fn: {
					before: function(){
						form.find("[type=submit]").prop("disabled", true);
					}, after: function(resp){
						form.find("[type=submit]").prop("disabled", false);
						
						if(resp.band){
							$('#winDetalleAuto').modal("hide");
							getLista();
						}else
							mensajes.alert({"titulo": "Error", mensaje: "No se pudo registrar los datos"});
					}
				}
			});
		}
	});
	
}
globaldata = null;
heatlayer = null;
$().ready(function(){
	console.log('ready');

	$.get('./data/all_pois.json', function(res) {
		console.log(res);
		globaldata = res;
		render(0,0,0,0,0);
	});
});

function render(s1,s2,s3,s4,s5)
{

	if (heatlayer)
	{
		map.removeLayer(heatlayer)
	}
	var datalist = [];

	globaldata.features.forEach(function(feature) {
		var stadtteilfactor = feature.properties.dichte * s1
				    + feature.properties.farbe * s2
				    + feature.properties.wahl * s3;

		stadtteilfactor = (stadtteilfactor > 0) * stadtteilfactor; //ReLU

		// Offset von 0.3 soll durch 'Wohngebiete' als neue Dimension ersetzt werden.
		var gewicht =  3. * stadtteilfactor * (0.3 + feature.properties.stops * s5 - feature.properties.kinder * s4);

		if(gewicht > 0.01) {					   // ReLU
			var coordinates = feature.geometry.coordinates;
			datalist.push([coordinates[1], coordinates[0], gewicht])
		}
	});
	heatlayer = L.heatLayer(datalist, {radius: 50}).addTo(map);
}

function renderObj()
{
	var val1 = $('#slider1').val();
	val1 = (val1 / 5) - 1;

	var val2 = $('#slider2').val();
	val2 = (val2 / 5) - 1;

	var val3 = $('#slider3').val();
	val3 = (val3 / 5) - 1;

	var val4 = $('#slider4').val();
	val4 = (val4 / 5) - 1;
	
	var val5 = $('#slider5').val();
	val5 = (val5 / 10);

	render(val1,val2,val3,val4,val5);
}

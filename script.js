//Creating icons for the user and the destination
var UserIcon = L.icon({
	iconUrl: 'userMarker.png',
	iconSize: [50, 50],
	iconAnchor: [25, 50],
	popupAnchor: [0, -50]
});
var destinationIcon = L.icon({
	iconUrl: 'destinationMarker.png',
	iconSize: [50, 50],
	iconAnchor: [25, 50],
	popupAnchor: [0, -50] 
});

//Declaring the variables
let lat = 40.3262; //Latitud y longitud por defecto Leganes
let lon = -3.7589;
let destinoMarker = null; // por defecto no existe un destino
let alarmaaa = new Audio('alarmaaa.mp3');
let battleship_alarm = new Audio('battleship-alarm.wav');
let citysiren_alarm = new Audio('citysiren-alarm.wav');
let freaks_alarm = new Audio('freaks-alarm.mp4');
let audio = alarmaaa; // Establece por defecto alarmaaa
let alarmSounds = {
    'alarmaaa': alarmaaa,
    'battleship_alarm': battleship_alarm,
    'citysiren_alarm': citysiren_alarm,
    'freaks_alarm': freaks_alarm
};


if (navigator.geolocation) {

	document.addEventListener('DOMContentLoaded', function() {
		document.querySelectorAll('.dropdown-content a').forEach(function(option) {
			option.addEventListener('click', function() {
				audio = alarmSounds[this.textContent];
			});
		});
	});

	navigator.geolocation.getCurrentPosition(function(position) {
		lat = position.coords.latitude;
		lon = position.coords.longitude;
	});

	const mymap = L.map('map').setView([lat, lon], 17);
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
	maxZoom: 18
	}).addTo(mymap);

	mymap.on('click', function(e) {
		if (destinoMarker) {
			mymap.removeLayer(destinoMarker);
		}
		destinoMarker = L.marker(e.latlng, { icon: destinationIcon }).addTo(mymap);
	});
  
	let userMarker = L.marker([lat, lon], { icon: UserIcon }).addTo(mymap);
  
	navigator.geolocation.watchPosition(function(position) {
		let lat = position.coords.latitude;
		let lon = position.coords.longitude;
		let newLatLng = new L.LatLng(lat, lon);
		userMarker.setLatLng(newLatLng);
		if (destinoMarker)
		{
			let distanceToDestination = mymap.distance(newLatLng, destinoMarker.getLatLng());
			let volume = 1 - (distanceToDestination / 500);
			// Si el usuario está a menos de 500 metros del destino, vibra y suena una alarma
			if (distanceToDestination < 500)
			{
				navigator.vibrate(1000); // Vibra durante 1000 milisegundos
				audio.volume = volume;
				audio.play();
				// Muestra un cuadro de diálogo al usuario
				Swal.fire({
					title: 'Has llegado a tu destino',
					text: '¿Quieres desactivar la alarma?',
					icon: 'warning',
					showCancelButton: true,
					confirmButtonText: 'Sí',
					cancelButtonText: 'No',
					backdrop: 'rgba(0,0,0,0)',
					allowOutsideClick: false
				}).then((result) =>
				{
					if (result.isConfirmed)
					{
						// Si el usuario hace clic en "Sí", detén la alarma
						audio.pause();
						audio.currentTime = 0;
						navigator.vibrate(0);
						mymap.removeLayer(destinoMarker);
						destinoMarker = null;
					}
				});
			}
			else
			{
				audio.pause(); // Pausa el sonido
				audio.currentTime = 0; // Opcional: rebobina el audio para la próxima vez que se reproduzca
				navigator.vibrate(0); // Detiene la vibración
			}
		}
	});
  
	let geocoder = L.Control.geocoder({
		collapsed: false,
		placeholder: 'Buscar dirección...',
		defaultMarkGeocode: false
	}).addTo(mymap);

	geocoder.on('markgeocode', function(e) {
	if (destinoMarker)
	{
		mymap.removeLayer(destinoMarker);
	}
		let latlng = e.geocode.center;
		destinoMarker = L.marker(latlng, { icon: destinationIcon }).addTo(mymap);

		// Centrar el mapa en las coordenadas del lugar marcado
		mymap.setView(latlng);
	});

	document.getElementById('centerButton').addEventListener('click', function() {
		console.log("Center button clicked");
		navigator.geolocation.getCurrentPosition(function(position) {
			let lat = position.coords.latitude;
			let lon = position.coords.longitude;
			console.log("Centering map at", lat, lon);
			mymap.setView([lat, lon], 17);
		});

	});
}
else
{
	alert("Could not get your location");
	console.log("Could not get your location");
}
//Creating icons for the user and the destination
var UserIcon = L.icon({
	iconUrl: 'media/userMarker.png',
	iconSize: [50, 50],
	iconAnchor: [25, 50],
	popupAnchor: [0, -50]
});
var destinationIcon = L.icon({
	iconUrl: 'media/destinationMarker.png',
	iconSize: [50, 50],
	iconAnchor: [25, 50],
	popupAnchor: [0, -50] 
});

//Declaring the variables
let lat = 40.3262; //Latitud y longitud por defecto Leganes
let lon = -3.7589;
let destinoMarker = null; // por defecto no existe un destino
let alarmaaa = new Audio('media/alarmaaa.mp3');
let battleship_alarm = new Audio('media/battleship-alarm.wav');
let citysiren_alarm = new Audio('media/citysiren-alarm.wav');
let freaks_alarm = new Audio('media/freaks-alarm.mp4');
let audio = alarmaaa; // Establece por defecto alarmaaa
let umbraldistancia = 1000; // Establece por defecto 1000 metros
let alarmSounds = {
    'Pruebalo!': alarmaaa,
    'Battleship': battleship_alarm,
    'CitySiren': citysiren_alarm,
    'Freaks': freaks_alarm
};

// Manejo de ajustes
document.addEventListener('DOMContentLoaded', function () {
    var settingsButton = document.getElementById('settingsButton');
    var settingsMenu = document.getElementById('settingsMenu');
    var distanceRange = document.getElementById('distanceRange');
    var distanceValue = document.getElementById('distanceValue');
	var saveButton = document.getElementById('saveButton');

    // Mostrar u ocultar el menú de ajustes al hacer clic en el botón de ajustes
    settingsButton.addEventListener('click', function () {
        if (settingsMenu.style.display === 'block') {
            settingsMenu.style.display = 'none';
        } else {
            settingsMenu.style.display = 'block';
        }
    });

    // Actualizar el valor de la distancia cuando se cambia el rango
    distanceRange.addEventListener('input', function () {
        distanceValue.textContent = distanceRange.value + ' m';
		umbraldistancia = distanceRange.value;
    });

    // Manejar los clics en los botones de audio y cerrar menu
    var audioButtons = document.querySelectorAll('.settings-menu button');
    audioButtons.forEach(function(button) {
        button.addEventListener('click', function() {
			if (button.textContent === 'Guardar'){
				settingsMenu.style.display = 'none';
			}
			else{
            	audio = alarmSounds[this.textContent];
			}
        });
    });
});

if (navigator.geolocation) {

	// Obtiene la ubicación del usuario
	navigator.geolocation.getCurrentPosition(function(position) {
		lat = position.coords.latitude;
		lon = position.coords.longitude;
	});

	// Inicializamos mapa
	const mymap = L.map('map').setView([lat, lon], 17);
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
	maxZoom: 18
	}).addTo(mymap);

	// Centra el mapa al inicio
	function centrarAlEmpezar() {
		mymap.setView([lat, lon], 17);
	}
	setTimeout(centrarAlEmpezar, 1000);

	// Añade un unico marcador en el mapa al hacer clic
	mymap.on('click', function(e) {
		if (destinoMarker) {
			mymap.removeLayer(destinoMarker);
		}
		destinoMarker = L.marker(e.latlng, { icon: destinationIcon }).addTo(mymap);
	});

	// Añade un marcador en el mapa para el usuario, que se actualiza en tiempo real
	let userMarker = L.marker([lat, lon], { icon: UserIcon }).addTo(mymap);
	navigator.geolocation.watchPosition(function(position) {
		let lat = position.coords.latitude;
		let lon = position.coords.longitude;
		let newLatLng = new L.LatLng(lat, lon);
		userMarker.setLatLng(newLatLng);
		// Funcionalidad de la alarma
		if (destinoMarker)
		{
			let distanceToDestination = mymap.distance(newLatLng, destinoMarker.getLatLng());
			let volume = 1 - (distanceToDestination / 500);
			// Si el usuario está a menos de 1 km metros del destino, vibra y suena una alarma
			if (distanceToDestination < umbraldistancia)
			{
				navigator.vibrate(1000);
				audio.volume = volume;
				audio.play();
				settingsMenu.style.display = 'none'; // Si esta el menu abierto, lo cierra
				// Muestra un cuadro de diálogo al usuario
				Swal.fire({
					title: 'Has llegado a tu destino',
					text: '¿Quieres desactivar la alarma?',
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: 'Apagar',
					allowOutsideClick: false
				}).then((result) =>
				{
					if (result.isConfirmed)
					{
						// Si el usuario hace clic en "Sí", detén la alarma y desaparece el marcador del destino
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
				audio.pause();
				audio.currentTime = 0;
				navigator.vibrate(0);
			}
		}
	});

	// Añade un control de búsqueda de direcciones
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
		mymap.setView(latlng);
	});

	// Botón para centrar el mapa en la ubicación del usuario
	document.getElementById('centerButton').addEventListener('click', function() {
		navigator.geolocation.getCurrentPosition(function(position) {
			let lat = position.coords.latitude;
			let lon = position.coords.longitude;
			mymap.setView([lat, lon], 17);
		});
	});
}
else // Si el navegador no soporta geolocalización
{
	alert("Could not get your location");
}
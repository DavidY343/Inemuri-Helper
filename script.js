
if (navigator.geolocation) {
	// Create a new icon
	var UserIcon = L.icon({
		iconUrl: 'userMarker.png', // the URL of the image
		iconSize: [50, 50], // size of the icon
		iconAnchor: [25, 50], // point of the icon which will correspond to marker's location
		popupAnchor: [0, -50] // point from which the popup should open relative to the iconAnchor
	});
	var destinationMarker = L.icon({
		iconUrl: 'destinationMarker.png', // the URL of the image
		iconSize: [50, 50], // size of the icon
		iconAnchor: [25, 50], // point of the icon which will correspond to marker's location
		popupAnchor: [0, -50] // point from which the popup should open relative to the iconAnchor
	});
	let lat = 40.3262; 
	let lon = -3.7589; 
	let destinoMarker; // Marca el destino
	let audio = new Audio('alarma-para-despertar-3-.mp3');
	let canTrigger = true; // Si CanTrigger es verdadero, el usuario puede activar los eventos de alarma
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
	destinoMarker = L.marker(e.latlng, {icon: destinationMarker}).addTo(mymap);
	});

	let userMarker = L.marker([lat, lon], {icon: UserIcon}).addTo(mymap); // Marca la ubicación del usuario

    navigator.geolocation.watchPosition(function(position) {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        let newLatLng = new L.LatLng(lat, lon);
        userMarker.setLatLng(newLatLng);
		if (destinoMarker) {
			let distanceToDestination = mymap.distance(newLatLng, destinoMarker.getLatLng());
			let volume = 1 - (distanceToDestination / 500);
			// Si el usuario está a menos de 100 metros del destino, vibra y suena una alarma
			if (distanceToDestination < 500 && canTrigger) {
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
				}).then((result) => {
					if (result.isConfirmed) {
						// Si el usuario hace clic en "Sí", detén la alarma
						audio.pause();
						audio.currentTime = 0;
						alarm = false;
						canTrigger = false;
						navigator.vibrate(0);
					}
				});
			} else {
				audio.pause(); // Pausa el sonido
				audio.currentTime = 0; // Opcional: rebobina el audio para la próxima vez que se reproduzca
				navigator.vibrate(0); // Detiene la vibración
				console.log('yo soy el que cambio a true');
				canTrigger = true; // El usuario puede activar la alarma
			}
		}
    });

	let geocoder = L.Control.geocoder({
		collapsed: false,
		placeholder: 'Buscar dirección...',
		defaultMarkGeocode: false
	}).addTo(mymap);
	geocoder.on('markgeocode', function(e) {
		if (destinoMarker) {
			mymap.removeLayer(destinoMarker);
		}
		destinoMarker = L.marker(e.geocode.center, {icon: destinationMarker}).addTo(mymap);
	});
	setInterval(function() {
		console.log('Cantrigger vale:', canTrigger);
	}, 1000);
} 
else 
{
    alert("Could not get your location");
}



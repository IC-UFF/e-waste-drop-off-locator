var dropOffApp = {};

(function( window, app ) {

	'use strict';

	var document = window.document;

	app.pins = {
		recycle : '../img/recycle.png'
	};

	app.markers = [];

	app.init = function ( pos ) {

		var mapCanvas = document.getElementById( 'map-canvas' );
		var latLng = new google.maps.LatLng( pos.coords.latitude, pos.coords.longitude );
		var mapOptions = {
			center: latLng,
			zoom: 15,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		app.map = new google.maps.Map( mapCanvas, mapOptions );

		var center = new google.maps.Marker({
			position: latLng, 
			map: app.map,
			scrollwheel: true,
			streetViewControl: true,
			labels: true,
			pin: app.pins.recycle,
			title: "Sua posição"
		});

		app.markers.push( center );

	};

	function requestLocation( success ) {

		navigator.geolocation.getCurrentPosition( success, function() {

			alert( 'Você deve compartilhar a sua pocisão conosco...');

			requestLocation( success );

		});

	}

	document.addEventListener( "readystatechange", function() {

		if (document.readyState === "interactive") {

			if (navigator.geolocation) {

				requestLocation( app.init );

			} else {

				alert( 'Seu navegador não suporta' );

			}

		}

	}, false );

}( window, dropOffApp ));
var dropOffApp = {};

(function( window, app ) {

	'use strict';

	var document = window.document;

	app.pins = {
		recycle : 'img/recycle.png'
	};

	app.markers = [];

	app.cities = [ 'Niterói - RJ' ];

	app.init = function ( pos ) {

		var mapCanvas = document.getElementById( 'map-canvas' );
		var center = new google.maps.LatLng( pos.coords.latitude, pos.coords.longitude );
		var mapOptions = {
			center: center,
			zoom: 12,
			scrollwheel: true,
			streetViewControl: true,
			labels: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		app.map = new google.maps.Map( mapCanvas, mapOptions );

		var center = new google.maps.Marker({
			position: center, 
			map: app.map,
			title: "Sua posição"
		});

		app.markers.push( center );

		getJSON( 'data/niteroi-rj.json', function( data ) {

			var points = JSON.parse( data );

			points.forEach(function( pt ){

				app.markers.push( new google.maps.Marker({
					position: new google.maps.LatLng( pt.lat, pt.long ), 
					map: app.map,
					icon: app.pins.recycle,
					title: pt.name,
					//address : pt.address + ' ' + app.cities[ 0 ],
					//tels : pt.tels.slice( '|' )
				}));

			});

		});

	};

	function requestLocation( success ) {

		navigator.geolocation.getCurrentPosition( success, function() {

			alert( 'Você deve compartilhar a sua posição conosco...');

			requestLocation( success );

		});

	}

	function getJSON( url, success ) {

		var xhr = new XMLHttpRequest();

		xhr.open( 'GET', url, true );
		xhr.send( null );
		xhr.onreadystatechange = function() {
				if ( this.status == 200 && this.readyState == 4 ) {

						success(this.responseText);

				}

		};

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
var dropOffApp = {};

(function( window, app ) {

	'use strict';

	var document = window.document;

	app.pins = {
		recycle : 'img/recycle.png'
	};

	app.points = [];

	app.cities = [ 'Niterói - RJ' ];

	app.init = function ( pos ) {

		getJSON( 'data/niteroi-rj.json', function( data ) {
			
			var city = JSON.parse( data );

			var mapCanvas = document.getElementById( 'map-canvas' );

			var center = ( pos ) ? new google.maps.LatLng( pos.coords.latitude, pos.coords.longitude ) :
														 new google.maps.LatLng( city.center.lat, city.center.long );

			var mapOptions = {
				center: center,
				zoom: 12,
				scrollwheel: true,
				streetViewControl: true,
				labels: true,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};

			app.map = new google.maps.Map( mapCanvas, mapOptions );

			if ( pos ) {

				app.points.push( new google.maps.Marker({
					position: center, 
					map: app.map,
					title: "Sua posição"
				}));

			}

			city.points.forEach(function( pt ){

				var pos = new google.maps.LatLng( pt.lat, pt.long );

				var marker = new google.maps.Marker({
					position: pos, 
					map: app.map,
					icon: app.pins.recycle,
					title: pt.name,
					//address : pt.address + ' ' + app.cities[ 0 ],
					//tels : pt.tels.slice( '|' ),
					infoWindow : new google.maps.InfoWindow({
						content: pt.name + '<br>' + pt.address + ' ' + app.cities[ 0 ] + '<br>' + pt.tels.slice( '|' ),
						position: pos
					})
				});

				google.maps.event.addListener( marker, 'click', function( e ) {
					
					marker.infoWindow.open( marker.map );

				});

				app.points.push( marker );

			});

		});

	};

	function requestUserLocation( success, failMsg ) {

		navigator.geolocation.getCurrentPosition( success, function() {

			if ( confirm( failMsg ) ) {

				requestUserLocation( success, failMsg );

			}

			success();

		});

	}

	function getJSON( url, success ) {

		var xhr = new XMLHttpRequest();

		xhr.open( 'GET', url, true );
		xhr.send( null );
		xhr.onreadystatechange = function() {

				if ( this.status === 200 && this.readyState === 4 ) {

						success( this.responseText );

				}

		};

	}

	document.addEventListener( "readystatechange", function() {

		if ( document.readyState === "interactive" ) {

			if ( navigator.geolocation ) {

				requestUserLocation( app.init, 'Você deve compartilhar a sua posição conosco para podermos identificar os pontos de coleta próximos à você' );

			} else {

				app.init();

			}

		}

	}, false );

}( window, dropOffApp ));
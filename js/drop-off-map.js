var dropOffApp = {};

(function( window, app ) {

	'use strict';

	var document = window.document;

	app.pins = {
		recycle : 'img/recycle.png'
	};

	app.init = function ( pos ) {

		//app.points = [];

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

				// app.points.push( {
				// 	'user' : 
					new google.maps.Marker({
						position: center, 
						map: app.map,
						title: "Sua posição"
					});
				//});

			}

			city.points.forEach(function( pt ){

				var pos = new google.maps.LatLng( pt.lat, pt.long );

				var infoWindowContent = '<div class="gm-title">' + pt.name + '</div>' + 
																'<div class="gm-basicinfo">' + 
																	'<div>' + pt.address + ', ' + city.name + ' - ' + city.region + '</div>' + 
																	'<div>' + pt.tels.slice( '|' ) + '</div>' + 
																'</div>';

				var marker = new google.maps.Marker({
					position: pos, 
					map: app.map,
					icon: app.pins.recycle,
					title: pt.name,
					//address : pt.address + ' ' + app.cities[ 0 ],
					//tels : pt.tels.slice( '|' ),
					infoWindow : new google.maps.InfoWindow({
						content: infoWindowContent,
						position: pos
					})
				});

				google.maps.event.addListener( marker, 'click', function( e ) {
					
					marker.infoWindow.open( marker.map );
					marker.map.setZoom( 16 );
    			marker.map.setCenter( marker.getPosition() );

				});

				//app.points.push( { pt.name : marker } );

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
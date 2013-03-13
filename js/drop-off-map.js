var dropOffApp = {};

(function( window, app ) {

	'use strict';

	var doc = window.document;

	app.pins = {
		recycle : 'img/recycle.png'
	};

	app.init = function ( userPos ) {

		//app.points = [];

		getJSON( 'data/niteroi-rj.json', function( data ) {
			
			var city = JSON.parse( data );

			var mapCanvas = doc.getElementById( 'map-canvas' );
			var infoWindowTemplate = Handlebars.compile( doc.getElementById( 'map-pop-tmpl' ).innerHTML );
			var sidebarLinkTemplate = Handlebars.compile( doc.getElementById( 'sidebar-link-tmpl' ).innerHTML );
			var pointList = doc.getElementById( 'point-list' );

			var center = ( userPos ) ? new google.maps.LatLng( userPos.coords.latitude, userPos.coords.longitude ) :
																 new google.maps.LatLng( city.center.lat, city.center.long );

			var mapOptions = {
				center: center,
				zoom: 12,
				scrollwheel: false,
				streetViewControl: true,
				labels: true,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};

			app.map = new google.maps.Map( mapCanvas, mapOptions );

			if ( userPos ) {

				// app.points.push( {
				// 	'user' : 
					new google.maps.Marker({
						position: center, 
						map: app.map
					});
				//});

			}

			city.points.forEach(function( point ){

				var pos = new google.maps.LatLng( point.lat, point.long );

				var marker = new google.maps.Marker({
					position: pos, 
					map: app.map,
					icon: app.pins.recycle,
					infoWindow : new google.maps.InfoWindow({
						content: infoWindowTemplate( point ),
						position: pos
					})
				});

				google.maps.event.addListener( marker, 'click', function( e ) {
					
					marker.infoWindow.open( marker.map );
					marker.map.setZoom( 16 );
    			marker.map.setCenter( marker.getPosition() );

				});

				pointList.innerHTML += ( sidebarLinkTemplate( point ) );
				//app.points.push( { point.name : marker } );

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

			// if ( navigator.geolocation ) {

			// 	requestUserLocation( app.init, 'Você deve compartilhar a sua posição conosco para podermos identificar os pontos de coleta próximos à você' );

			// } else {

				app.init();

			// }

		}

	}, false );

}( window, dropOffApp ));
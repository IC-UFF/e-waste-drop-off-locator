var dropOffApp = {};

(function( window, $, app ) {

	'use strict';

	var doc = window.document;

	app.pins = {
		recycle : 'img/recycle.png'
	};

	app.init = function ( userPos ) {

		app.points = [];

		$.getJSON( 'data/niteroi-rj.json', function( city ) {

			var mapCanvas = doc.getElementById( 'map-canvas' );
			var infoWindowTemplate = Handlebars.compile( doc.getElementById( 'map-pop-tmpl' ).innerHTML );
			var sidebarLinkTemplate = Handlebars.compile( doc.getElementById( 'sidebar-link-tmpl' ).innerHTML );
			
			var $pointList = $( '#point-list' );

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

				var handleFunc = function() {
					
					if ( app.map.oppenned ) {

						app.map.oppenned.infoWindow.close();

					}

					marker.infoWindow.open( marker.map );
					app.map.oppenned = marker;
					marker.map.setZoom( 16 );
					marker.map.setCenter( marker.getPosition() );
					return false;

				};

				var sidebarItem = $( $.parseHTML( sidebarLinkTemplate( point ) ) );

				google.maps.event.addListener( marker, 'click', handleFunc );
				google.maps.event.addDomListener( sidebarItem.find( 'a' )[ 0 ], 'click', handleFunc );

				$pointList.append( sidebarItem );
				
				app.points.push( marker );

			});

		});

	};

	$(function(){

		app.init();

	});

}( window, jQuery, dropOffApp ));
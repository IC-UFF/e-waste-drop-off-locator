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

				app.points.push( new google.maps.Marker({
					position: center, 
					map: app.map
				}));

			}

			var $sidebarFragment = $( doc.createDocumentFragment() );

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

				var handleFunc = function( e ) {

					var marker = ( this.attributes ) ? app.points[ this.attributes[ 'data-marker' ].value ] : this;

					e.preventDefault && e.preventDefault();
					
					if ( marker.map.oppened ) {

						if ( marker.map.oppened === marker ) {
	
							marker.map.setZoom( 16 );
							marker.map.setCenter( marker.getPosition() );
							return;

						}

						marker.map.oppened.infoWindow.close();
						marker.map.oppened.sidebarItem.removeClass( 'active' );
						
					}

					marker.infoWindow.open( marker.map, marker);
					marker.map.oppened = marker;
					marker.map.setZoom( 16 );
					marker.map.setCenter( marker.getPosition() );
					marker.sidebarItem.addClass( 'active' );

				};

				var sidebarItem = $( $.parseHTML( sidebarLinkTemplate( point ) ) );
				var sidebarItemLink = sidebarItem.find( 'a' );

				google.maps.event.addListener( marker, 'click', handleFunc );
				google.maps.event.addDomListener( sidebarItemLink[ 0 ], 'click', handleFunc );
				google.maps.event.addListener( marker.infoWindow, 'closeclick', function() {
					marker.sidebarItem.removeClass( 'active' );
					marker.map.oppened = null;
				});

				marker.sidebarItem = sidebarItem;
				
				sidebarItemLink.attr( 'data-marker' , app.points.push( marker ) -1 );

				$sidebarFragment.append( sidebarItem );

			});

			$pointList.append( $sidebarFragment );

		});

	};

	$(function(){

		app.init();

	});

}( window, jQuery, dropOffApp ));
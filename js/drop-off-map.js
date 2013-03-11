angular.module( 'drop-off-map', [ 'ui' ] );

function MapCtrl( $scope ) {

	var latLng = new google.maps.LatLng( pos.coords.latitude, pos.coords.longitude );

	$scope.mapOptions = {
		center: latLng,
		zoom: 15,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	$scope.onMapIdle = function() {

		var marker = new google.maps.Marker({
			icon: '../img/recycle.png',
			map: $scope.myMap,
			position: latLng,
			name: 'Center',
			title: 'Você está aqui!'
		});

		$scope.myMarkers = [marker, ];

	};

	$scope.markerClicked = function( m ) {

		window.alert( this.center );

	};

}
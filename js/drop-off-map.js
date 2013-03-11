angular.module('drop-off-map', ['ui']);

function MapCtrl($scope) {
	var latLng = new google.maps.LatLng(13.0810, 80.2740);
	$scope.mapOptions = {
		center: latLng,
		zoom: 15,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	$scope.onMapIdle = function() {
		var marker = new google.maps.Marker({
			map: $scope.myMap,
			position: latLng,
			name: 'Center'
		});
		$scope.myMarkers = [marker, ];
	};

	$scope.markerClicked = function(m) {
		window.alert( this.center );
	};

}
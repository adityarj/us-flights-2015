var app = angular.module('flightApp',[]);

app.controller('mainController',['$scope','$http',function($scope,$http) {
	//SVG draw parameters
	var margin = {top: 0, right: 0, bottom: 0, left: 0}, padding = 3;
	$scope.width = 960 - margin.left - margin.right;
	$scope.height = 500 - margin.top - margin.bottom;
	$scope.translate = "translate(" + margin.left + "," + margin.top + ")";

	//Scope variables that are changed by the user and loaded through HTTP
	$scope.data = [];
	$scope.filter = [];
	$scope.parameter = {value: 'ontime'};
	$scope.airlineColors = [];
	$scope.isDeparture = true;
	$scope.parameterOptions = ['ontime','delayed','cancelled','diverted'];

	function loadData(filename) {
		$http.get(filename)
			.then(function(data) {
				$scope.data = data.data.features;
				for (var i = 0; i<airlines.length; i++) {
					$scope.filter.push({code: airlines[i].airline, name: airlines[i].name, color: airlines[i].color, value: true})
				}

			})
	}

	loadData("flights.json");

}])
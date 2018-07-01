app.directive('pieDorling',['tickService',function(tickService) {

	return {
		restrict: 'E',
		scope: {
			data: '=',
			access: '=',
			width: '=',
			height: '=',
			filter: '=',
			depart: '='
		},
		link: function($scope) {

			// Initializing variables
			$scope.processedData = [];
			$scope.departArrive = 'dep';
			$scope.focusState = 'total';
			$scope.focusStateName = 'Total';

			var padding = 3;
			var projection = d3.geo.albersUsa();
			var force = d3.layout.force()
					.charge(0)
					.gravity(0)
					.size([$scope.width, $scope.height]);


			var pie = d3.layout.pie()
				.sort(null)
				.value(function(d) {
					return d.value;
				}) 

			//Watch for changes to variable, if there are changes, process data again
			$scope.$watch('data',function() {
				processData();
			});
			$scope.$watch('access',function() {
				processData();
			})
			$scope.$watch('filter',function() {
				processData();
			},true)
			$scope.$watch('access',function() {
				processData();
			},true)
			$scope.$watch('depart',function() {
				$scope.departArrive = $scope.depart ? 'dep' : 'arr';
				processData();
			},true)

			//Functions to handle interactiveness or chart related properties
			$scope.color = function(inp) {
				for (var i = 0; i<$scope.filter.length;i++) {
					if ($scope.filter[i].code == inp.airline) {
						return $scope.filter[i].color;
					}
				}
			}

			$scope.selectState = function(state) {
				$scope.focusState = state.code;
				$scope.focusStateName = state.state;
				processData();
			}

			$scope.resetSelectState = function() {
				$scope.focusState = 'total';
				$scope.focusStateName = 'Total';
				processData();
			}

			//Process the data and trigger the force function
			function processData() {
				var radius = d3.scale.sqrt()
					.domain([0, d3.max($scope.data,function(d) {
						return aggregateFlights(d.properties.flights[$scope.departArrive][$scope.focusState],$scope.access.value,$scope.filter);
					})])
					.range([0, 60]);

				$scope.processedData = $scope.data
						.map(function(d,i) {
							var point = projection(d.geometry.coordinates),
								flightChunk = d.properties.flights[$scope.departArrive][$scope.focusState];
								value = aggregateFlights(flightChunk,$scope.access.value,$scope.filter),
								pie_ = pie(processPie(flightChunk,$scope.access.value,$scope.filter)),
								arc = d3.svg.arc().outerRadius(radius(value)).innerRadius(0);

							return {
								x: point[0], y: point[1],
								x0: point[0], y0: point[1],
								r: radius(value),
								pie: pie_,
								arc: arc,
								state: d.properties.name,
								code: d.properties.code
							};
						});

				force
					.nodes($scope.processedData)
					.on("tick", tick)
					.start();

				function aggregateFlights(flights,property,filter) {
					var sum = 0;
					for (var i = 0; i<filter.length;i++) {
						if (filter[i].value) {
							sum += flights[filter[i].code][property];
						}
					}
					return sum;
				}

				function processPie(flights,property,filter) {
					var data = [];
					for (var i = 0; i<filter.length; i++) {
						if (filter[i].value) {
							data.push({airline: filter[i].code, value: flights[filter[i].code][property]});
						}
					}
					return data;
				}

				function tick(e) {
					$scope.processedData = tickService.tick($scope.processedData,e.alpha)
					$scope.$apply();
				}
			}
		},
		templateUrl: 'visualization.html'
	}
}])
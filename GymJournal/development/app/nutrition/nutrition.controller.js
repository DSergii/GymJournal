;(function (){
'use strict'
angular
	.module('GymJournal.nutrition', ['ngRoute', 'ngAnimate'])
	.config(NutritionConfig)
	.controller('NutritionCtrl', NutritionCtrl);

	NutritionCtrl.$inject = ['$scope', '$rootScope', '$http'];

	function NutritionCtrl($scope, $rootScope, $http){

		$rootScope.curPath = 'nutrition';

		$http.get('app/nutrition.json').success(function(data) {
			$scope.article = data;
		});

		
	}

	function NutritionConfig($routeProvider){
		$routeProvider
			.when('/nutrition', {
				templateUrl: 'app/nutrition/nutrition.html',
				controller: 'NutritionCtrl'
			});
	}
})();
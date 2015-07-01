;(function (){
'use strict'
angular
	.module('GymJournal.nutrition', ['ngRoute'])
	.config(NutritionConfig)
	.controller('NutritionCtrl', NutritionCtrl);

	NutritionCtrl.$inject = ['$scope', '$rootScope'];

	function NutritionCtrl($scope, $rootScope){
		$scope.title = 'Nutrition';
		$rootScope.curPath = 'nutrition';
	}

	function NutritionConfig($routeProvider){
		$routeProvider
			.when('/nutrition', {
				templateUrl: 'app/nutrition/nutrition.html',
				controller: 'NutritionCtrl'
			});
	}
})();
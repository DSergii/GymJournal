;(function (){
'use strict'
angular
	.module('GymJournal.nutrition', ['ui.router', 'ngAnimate'])
	.config(NutritionConfig)
	.controller('NutritionCtrl', NutritionCtrl);

	NutritionCtrl.$inject = ['$scope', '$rootScope', '$http'];

	function NutritionCtrl($scope, $rootScope, $http){

		$rootScope.curPath = 'nutrition';

		$http.get('app/nutrition.json').success(function(data) {
			$scope.article = data;
		});
		
	}

	function NutritionConfig($stateProvider){
		$stateProvider
			.state('nutrition', {
				url: '/nutrition',
				templateUrl: 'app/nutrition/nutrition.html',
				controller: 'NutritionCtrl',
				controllerAs: 'nc'
			});
	}
})();
;(function (){
'use strict'
angular
	.module('GymJournal.nutrition', ['ui.router', 'ngAnimate'])
	.controller('NutritionCtrl', NutritionCtrl);

	NutritionCtrl.$inject = ['$scope', '$rootScope', '$http'];

	function NutritionCtrl($scope, $rootScope, $http){

		$rootScope.curPath = 'nutrition';

		$http.get('app/nutrition.json').success(function(data) {
			//console.log(data)
			$scope.article = data;
			
		});
		
	}

})();
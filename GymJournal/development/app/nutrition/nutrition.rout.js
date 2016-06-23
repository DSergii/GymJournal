;(function() {
	'use strict';

	angular
		.module('GymJournal.nutrition')
		.config(nutritionConfig);

	function nutritionConfig($stateProvider) {
		$stateProvider
			.state('nutrition', {
				url: '/nutrition',
				templateUrl: 'app/nutrition/nutrition.html',
				controller: 'NutritionCtrl',
				controllerAs: 'nc'
			});
	}

})();
;(function() {
	'use strict';

	angular
		.module('GymJournal.statistics')
		.config(statisticsConfig)


	function statisticsConfig($stateProvider){
		$stateProvider
			.state('statistics',
			 {
				url: '/statistics',
				templateUrl: 'app/statistics/statistics.html',
				controller: 'StatisticCtrl',
				controllerAs: 'sc'
			});
	}

})();
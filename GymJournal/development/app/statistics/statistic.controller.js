;(function (){
'use strict'
angular
	.module('GymJournal.statistics', ['ngRoute'])
	.config(StatisticsConfig)
	.controller('StatisticCtrl', StatisticCtrl);

	StatisticCtrl.$inject = ['$scope', '$rootScope'];

	function StatisticCtrl($scope, $rootScope){
		$scope.title = 'Statistics';
		$rootScope.curPath = 'statistics';
	}

	function StatisticsConfig($routeProvider){
		$routeProvider
			.when('/statistics', {
				templateUrl: 'app/statistics/statistics.html',
				controller: 'StatisticCtrl'
			});
	}
})();
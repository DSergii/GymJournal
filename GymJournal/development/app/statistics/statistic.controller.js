;(function (){
'use strict'
angular
	.module('GymJournal.statistics', ['ui.router', 'chart.js'])
	.config(StatisticsConfig)
	.controller('StatisticCtrl', StatisticCtrl);

	StatisticCtrl.$inject = ['$scope', '$rootScope'];

	function StatisticCtrl($scope, $rootScope){
		var vm = this;
		$scope.title = 'Statistics';
		$rootScope.curPath = 'statistics';

		vm.labels = ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"];

		vm.data = [
		    [65, 59, 80, 81, 56, 55, 40],
		    [28, 48, 40, 19, 86, 27, 90]
		];
		vm.onClick = function (points, evt) {
		    console.log(points, evt);
		};
	}

	function StatisticsConfig($stateProvider){
		$stateProvider
			.state('statistics', {
				url: '/statistics',
				templateUrl: 'app/statistics/statistics.html',
				controller: 'StatisticCtrl',
				controllerAs: 'sc'
			});
	}
})();
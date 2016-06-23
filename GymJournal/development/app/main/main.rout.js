;(function() {
	'use strict';

	angular
		.module('GymJournal.main')
		.config(mainConfig);

	function mainConfig($stateProvider){
		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: 'app/main/main.html',
				controller: 'MainCtrl',
				controllerAs: 'mc'
			});
	}

})();
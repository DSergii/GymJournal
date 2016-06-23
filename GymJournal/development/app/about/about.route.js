;(function() {
	'use strict';

	angular
		.module('GymJournal.about' )
		.config(configAbout);

	function configAbout($stateProvider) {
		$stateProvider
			.state('about', {
				url: '/about',
				templateUrl: 'app/about/about.html',
				controller: 'AboutCtrl',
				controllerAs: 'ac'
			});
	}

})();
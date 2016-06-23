;(function() {
	'use strict';

	angular
		.module('GymJournal.profile')
		.config(profileConfig);

	function profileConfig($stateProvider){
		$stateProvider
			.state('profile', {
				url: '/profile',
				templateUrl: 'app/profile/profile.html',
				controller: 'ProfileCtrl',
				controllerAs: 'pc'
			});
	}

})();
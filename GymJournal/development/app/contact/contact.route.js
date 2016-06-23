;(function() {
	'use strict';

	angular
		.module('GymJournal.contact' )
		.config(configContact);

	function configContact($stateProvider) {
		$stateProvider
			.state('contact', {
				url: '/contact',
				templateUrl: 'app/contact/contact.html',
				controller: 'ContactCtrl',
				controllerAs: 'cc'
			});
	}

})();
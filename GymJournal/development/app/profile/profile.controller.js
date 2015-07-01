;(function (){
'use strict'
angular
	.module('GymJournal.profile', ['ngRoute'])
	.config(ProfileConfig)
	.controller('ProfileCtrl', ProfileCtrl);

	ProfileCtrl.$inject = ['$scope', '$rootScope'];

	function ProfileCtrl($scope, $rootScope){
		$scope.title = 'Profile';
		$rootScope.curPath = 'profile';
	}

	function ProfileConfig($routeProvider){
		$routeProvider
			.when('/profile', {
				templateUrl: 'app/profile/profile.html',
				controller: 'ProfileCtrl'
			});
	}
})();
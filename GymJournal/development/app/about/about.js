;(function(){
	'use strict';

	angular
		.module('GymJournal.about', ['ui.router'])
		.controller('AboutCtrl', AboutCtrl);
		
		AboutCtrl.$inject = ['$scope', '$rootScope'];
		
		function AboutCtrl($scope, $rootScope){

			var vm = this;
			$rootScope.curPath = 'about';
		}
	
})();
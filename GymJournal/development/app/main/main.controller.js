;(function(){
'use strict'

	angular
		.module('GymJournal.main', ['ngRoute'])
		.config(configMain)
		.controller('MainCtrl', MainCtrl);

		MainCtrl.$inject = ['$scope', '$rootScope'];
		
		function MainCtrl($scope, $rootScope){

			var vm = this;

			vm.title = 'Main';
			$rootScope.curPath = 'home';

		}

		function configMain($routeProvider){
			$routeProvider
				.when('/home', {
					templateUrl: 'app/main/main.html',
					controller: 'MainCtrl',
					controllerAs: 'vm'
				});
		}

})();

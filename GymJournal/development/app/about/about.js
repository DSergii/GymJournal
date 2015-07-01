;(function(){
'use strict'

angular
	.module('GymJournal.about', ['ngRoute'])
	.config(['$routeProvider', configAbout])
	.controller('AboutCtrl', AboutCtrl);
	
	AboutCtrl.$inject = ['$scope', '$rootScope', 'gymfirebase'];
	
	function AboutCtrl($scope, $rootScope, gymfirebase){

		var vm = this;

		vm.title = 'Page About';
		$rootScope.curPath = 'about';

		gymfirebase.getUsers().then(function(_data){
			vm.users = _data;
		});

		vm.user = {
			name: null,
			age: 0
		}

		vm.addUser = function(){
		 	gymfirebase.addUser(vm.user);
		}
			

	}
	
	function configAbout($routeProvider){
		$routeProvider.
			when('/about', {
				templateUrl: 'app/about/about.html',
				controller: 'AboutCtrl',
				controllerAs: 'vm'
			});
	}
})();
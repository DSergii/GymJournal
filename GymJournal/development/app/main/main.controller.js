;(function(){
'use strict'

	angular
		.module('GymJournal.main', ['ui.router', 'ngAnimate'])
		.config(configMain)
		.controller('MainCtrl', MainCtrl);

		//MainCtrl.$inject = ['$scope', '$rootScope'];
		
		function MainCtrl($scope, $rootScope, FIREBASE_URL, exercisessrv, authentication){

			var vm = this;
			vm.box = [];
			vm.flag = false;
			$rootScope.curPath = 'home';

			vm.exer = '';
			exercisessrv.getExercise().then(function(_data){
				vm.exer = _data;
			});

			vm.addCount = function(num){
				for (var i = num; i > 0; i--) {
					vm.box.unshift(i);
				};
				vm.flag = true;
			}

		}

		function configMain($stateProvider){
			$stateProvider
				.state('home', {
					url: '/home',
					templateUrl: 'app/main/main.html',
					controller: 'MainCtrl',
					controllerAs: 'mc'
				});
		}

})();

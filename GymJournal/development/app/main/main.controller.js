;(function(){
'use strict'

	angular
		.module('GymJournal.main', ['ui.router', 'ngAnimate'])
		.config(configMain)
		.controller('MainCtrl', MainCtrl);

		//MainCtrl.$inject = ['$scope', '$rootScope'];
		
		function MainCtrl($scope, $rootScope, FIREBASE_URL, exercisessrv, authentication){

			var vm = this;

			vm.approach = 1;
			vm.mass = [1];
			vm.apprMass = [];
			vm.countApr;

			$rootScope.curPath = 'home';

			vm.exer = '';
			exercisessrv.getExercise().then(function(_data){
				vm.exer = _data;
			});

			vm.addApproach = function(){
				vm.approach++;
				vm.mass.push(vm.approach);
			};

			vm.saveEquipmentApproach = function(){
				vm.apprMass.push(vm.countApr);
				console.log(vm.apprMass);
				vm.countApr = '';
			};

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

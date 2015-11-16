;(function(){
	'use strict'

angular
	.module('GymJournal.exercises', ['ngRoute', 'GymJournal.login', 'youtube-embed'])
	.config(ConfigExercicses)
	.controller('ExercisesCtrl', ExercisesCtrl);


	//ExercisesCtrl.$inject = ['$scope', '$rootScope'];

	function ExercisesCtrl($scope, $rootScope, authentication, exercisessrv, $firebaseObject){
		var vm = this;
		$scope.title = 'Exercises';
		$rootScope.curPath = 'exercises';

		vm.authInfo = authentication.getAuth();


		
		vm.exArr = exercisessrv.getExercise();

		vm.exercises = {
			title: null,
			descr: null,
			link: null
		}
		vm.addExercise = function(){
			return exercisessrv.addExercise(vm.exercises, vm.authInfo.uid);
		}
		
		vm.exer = '';
		exercisessrv.getExercise().then(function(_data){
			vm.exer = _data;
		});
		
	}

	function ConfigExercicses($routeProvider){
		$routeProvider
			.when('/exercises', {
				templateUrl: 'app/exercises/exercises.html',
				controller: 'ExercisesCtrl',
				controllerAs: 'vm',
				/*resolve: {
					user: function(Auth, $q){
						return Auth.getUsername	|| $q.reject({unAuthorized: true})
					}
				}*/
			});
	}


})();
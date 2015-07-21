;(function(){
	'use strict'

angular
	.module('GymJournal.exercises', ['ngRoute', 'GymJournal.login'])
	.config(ConfigExercicses)
	.controller('ExercisesCtrl', ExercisesCtrl);


	//ExercisesCtrl.$inject = ['$scope', '$rootScope'];

	function ExercisesCtrl($scope, $rootScope, authentication, exercisessrv){
		var vm = this;
		$scope.title = 'Exercises';
		$rootScope.curPath = 'exercises';
		//console.log(exercisessrv.getExercise());
		//console.log(exercisessrv.getExercise());
		vm.authInfo = authentication.getAuth();
		
		vm.exArr = exercisessrv.getExercise();

		vm.exercises = {
			title: null,
			descr: null,
			link: null,
			amountIn: null,
			amount: null,
			time: null
		}

		vm.addExercise = function(){
			return exercisessrv.addExercise(vm.exercises);
		}


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
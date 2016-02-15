;(function(){
	'use strict'

angular
	.module('GymJournal.exercises', ['ui.router', 'GymJournal.login', 'youtube-embed'])
	.config(ConfigExercicses)
	.controller('ExercisesCtrl', ExercisesCtrl);


	//ExercisesCtrl.$inject = ['$scope', '$rootScope'];

	function ExercisesCtrl($scope, $rootScope, authentication, exercisessrv, $firebaseObject, GetMyExercises){
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
		console.log(GetMyExercises);
		vm.exer = GetMyExercises;
		// exercisessrv.getExercise().then(function(_data){
		// 	vm.exer = _data;
		// });
		
	}

	function ConfigExercicses($stateProvider){
		$stateProvider
			.state('exercises', {
				url: '/exercises',
				templateUrl: 'app/exercises/exercises.html',
				controller: 'ExercisesCtrl',
				controllerAs: 'ex',
				resolve : {
					GetMyExercises : function(exercisessrv){
						return exercisessrv.getExercise();
					}
				}
			});
	}


})();
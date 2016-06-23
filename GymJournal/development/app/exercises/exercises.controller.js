;(function(){
	'use strict'

angular
	.module('GymJournal.exercises', ['ui.router', 'GymJournal.login', 'youtube-embed'])
	.controller('ExercisesCtrl', ExercisesCtrl);


	//ExercisesCtrl.$inject = ['$scope', '$rootScope'];

	function ExercisesCtrl($scope, $rootScope, authentication, exercisessrv, GetMyExercises){
		var vm = this;
		$scope.title = 'Exercises';
		$rootScope.curPath = 'exercises';

		vm.exercises = {
			title: null,
			descr: null,
			link: null
		}

		vm.addExercise = function(){
			return exercisessrv.addExercise(vm.exercises, vm.authInfo.uid);
		}

		exercisessrv.getExercise().then(function(_data){
			console.log(_data);
			vm.exer = _data;
		});
		
	}

})();
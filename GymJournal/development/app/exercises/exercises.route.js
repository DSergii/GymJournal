;(function() {
	'use strict';

	angular
		.module('GymJournal.exercises' )
		.config(exercicsesConfig);

	function exercicsesConfig($stateProvider) {
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
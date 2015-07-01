;(function(){
	'use strict'

angular
	.module('GymJournal.exercises', ['ngRoute', 'GymJournal.login'])
	.config(ConfigExercicses)
	.controller('ExercisesCtrl', ExercisesCtrl);


	//ExercisesCtrl.$inject = ['$scope', '$rootScope'];

	function ExercisesCtrl($scope, $rootScope, authentication){
		var vm = this;
		$scope.title = 'Exercises';
		$rootScope.curPath = 'exercises';

		vm.authInfo = authentication.getAuth();
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
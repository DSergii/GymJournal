;(function(){
'use strict'

angular
	.module('GymJournal.exercises.srv', ['firebase'])
	.service('exercisessrv', exercisessrv);

	exercisessrv.$inject = ['$q', '$rootScope'];

	function exercisessrv($q, $rootScope){

		var rootRef = firebase.database().ref();

		var deferred = $q.defer();
		
		var regexp = /\d+/g;
		
		
		
		this.getExercise = function(){
			rootRef.on('value', function(snapshot) {
				//console.log(snapshot);
				var exercises = snapshot.val().exercises;
				//console.log('exercises ', exercises);
				//console.log('USER DATA ', $rootScope.userData);
				deferred.resolve( checkUser( exercises, $rootScope.userData ) );

			});

			return deferred.promise;
		}

		this.addExercise = function(exercises) {
			console.info('exercises', exercises);
			firebase.database().ref('exercises').set({
				data: exercises,
				user: $rootScope.userData.uid
			})
		}

		function checkUser(exercises, user) {

			var exercisesData = {};

			var count = 0;

			for( var key in exercises) {
				console.info('exercises ', exercises);
				if(exercises.hasOwnProperty(key)) {

					//if($rootScope.userData !== undefined && user !== null ){
						//console.info('100500 ', exercises[key].user,  user.uid);
						if(exercises[key].user === user.uid){

							exercisesData[count] = exercises[key].data;
							count++;
						}
					//}
				}

			}
			//console.info(exercisesData);
			return exercisesData;
		}

}
	


})();
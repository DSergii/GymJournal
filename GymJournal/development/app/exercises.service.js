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
				
				var exercises = snapshot.val().exercises;
				//console.log(exercises);
				//console.log('USER DATA ', $rootScope.userData);
				
				deferred.resolve( checkUser( exercises, $rootScope.userData ) );

			});

			return deferred.promise;
		}

		function checkUser(exercises, user) {

			var exercisesData = {};

			var count = 0;

			for( var key in exercises) {

				if(exercises.hasOwnProperty(key)) {

					if($rootScope.userData !== undefined && user !== null ){

						if(user.providerId === 'password' && exercises[key].user === $rootScope.userData.uid){
							exercisesData[count] = exercises[key].data;
							count++;
						}

						if(user.providerId !== 'password' && exercises[key].user.match(regexp)[0] === $rootScope.userData.uid) {
							exercisesData[count] = exercises[key].data;
							count++;
						}
					}
				}

			}

			return exercisesData;
		}

}
	


})();
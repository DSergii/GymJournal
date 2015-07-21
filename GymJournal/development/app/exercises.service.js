;(function(){
'use strict'

angular
	.module('GymJournal.exercises.srv', ['firebase'])
	.service('exercisessrv', exercisessrv);

	exercisessrv.$inject = ['FIREBASE_URL', '$firebaseArray', '$firebaseObject'];

	function exercisessrv(FIREBASE_URL, $firebaseArray, $firebaseObject){

		var exData = this;

		var ref = new Firebase(FIREBASE_URL);

		var exRef = ref.child('exercises');

		var refObj = $firebaseObject(ref); //$firebaseObject - не позволяет работать с ng-repeat

		var exArr = $firebaseArray(exRef); //$firebaseArray - позволяет работать с ng-repeat


		this.addExercise = function(_exersises){
			exRef.child('exercises').set(_exersises);
		}

		this.getExercise = function(){
			//return exRef.child('exercises').get(_exersises);
			return exArr.$loaded(function(_data){ //т.к. загрузка асинхронная, то $loaded возвращает промис
				return _data;
			});
		}

	}


})();
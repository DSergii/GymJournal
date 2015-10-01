;(function(){
'use strict'

angular
	.module('GymJournal.exercises.srv', ['firebase'])
	.service('exercisessrv', exercisessrv);

	exercisessrv.$inject = ['FIREBASE_URL', '$firebaseArray', '$firebaseObject', 'authentication'];

	function exercisessrv(FIREBASE_URL, $firebaseArray, $firebaseObject, authentication){

		var exData = this;

		var ref = new Firebase(FIREBASE_URL);

		var exRef = ref.child('exercises');

		var refObj = $firebaseObject(ref); //$firebaseObject - не позволяет работать с ng-repeat

		var exArr = $firebaseArray(exRef); //$firebaseArray - позволяет работать с ng-repeat
		//console.log(refObj.child('exersises'));
		this.addExercise = function(_exersises, _id){
			var exLength = $firebaseObject(ref.child('OptionsEx').child('exLength'));
			exLength.$loaded(function(){
				var eLength = exLength.$value++;
				exLength.$save();
				exRef.child(eLength).set({"data" : _exersises, "user" : _id});
			});
			//exRef.child(_exersises).set(_id);
			//var exLength = $firebaseObject(ref.child())...2015.06.13_2 1:51:31
			//закончил на 1:25
		}

		this.getExercise = function(){
			return exArr.$loaded(function(_data){
				return _data;
			});

		}		
			//	});
			//return exArr.child(_data); //т.к. загрузка асинхронная, то $loaded возвращает промис
}
	


})();
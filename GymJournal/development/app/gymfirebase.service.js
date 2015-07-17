;(function(){
'use strict'

	angular
		.module('GymJournal.gymfirebase.srv', ['firebase'])
		.service('gymfirebase', gymfirebase);


	gymfirebase.$inject = ['FIREBASE_URL', '$firebaseObject', '$firebaseArray', '$log'];


	function gymfirebase(FIREBASE_URL, $firebaseObject, $firebaseArray, $log){

		var dbData = this;

		/* подключение к БД */
		var ref = new Firebase(FIREBASE_URL);

		/* получение объекта из БД */
		var refObj = $firebaseObject(ref);

		/* получение массива из объекта БД */
		var refArr = $firebaseArray(ref);

		/*вернет только пользователей, все равно, что добавить users в конец url ->  https://gymjournal.firebaseio.com/users */
		var usersRef = ref.child('users');

		var usersArr = $firebaseArray(usersRef);

		this.getUsers = function(){
			return usersArr.$loaded(function(_data){
				return _data;
			});
		};

		this.getCurUser = function(_userid){
			return usersRef.child(_userid);
		}

		this.addUser = function(_user){
			var usersLength = $firebaseObject(ref.child('options').child('userLength'));
			$log.debug(usersLength);
			usersLength.$loaded(function(){
				var uLength = usersLength.$value++;
				usersLength.$save();
				usersRef.child(uLength).set(_user);
			});
		};

		// редактирование данных пользователя
		this.updateUser = function(_userid, _userData){

			usersRef.child( _userid ).set( _userData );

		};

		/* callback функция, возвращающая через промис объект из БД 
		(можно обойтись без нее, но она нужна для синхронной загрузки) */
		refObj.$loaded(function() {
			dbData.dbObj = refObj;
		});

		/* тот же callback только в виде массива */
		refArr.$loaded(function(){
			dbData.dbArr = refArr;
		});

	}


})();
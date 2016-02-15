;(function (){
'use strict'
angular
	.module('GymJournal.profile', ['ui.router'])
	.config(ProfileConfig)
	.controller('ProfileCtrl', ProfileCtrl);

	ProfileCtrl.$inject = ['$scope', '$rootScope', 'authentication', 'gymfirebase', '$log', '$firebaseObject', 'FIREBASE_URL'];

	function ProfileCtrl($scope, $rootScope, authentication, gymfirebase, $log, $firebaseObject, FIREBASE_URL){
		
		var vm = this;

		$rootScope.curPath = 'profile';

		var curUserUid = authentication.getAuth().uid;

		 gymfirebase.getUsers().then(function(_data){
		 	console.log(_data);
		 	vm.users = _data;
		 });

		vm.user = {
			name: null,
			lastname: null,
			email: null,
			height: null,
			weight: null,
			image: null,
			age: null
		}
		
		vm.getUsername = function(){
			return authentication.getUsername();
		}

		var ref = new Firebase(FIREBASE_URL);
		var authData = ref.getAuth();
		console.log(authData);
		if(authData !== null){
			var curUserUid = authentication.getAuth().uid;
			var userObj = gymfirebase.getCurUser(curUserUid);
			var curUser = $firebaseObject(userObj);
			curUser.$loaded().then(function(){ //когда пользователь загружен
				vm.userData  = authData; 
			});
		}
		
		//изменяем данные пользователя, на вход Uid в БД и данные из формы
		vm.updateUser = function(){
			return gymfirebase.updateUser(curUserUid, vm.user);
		}
		

	}

	function ProfileConfig($stateProvider){
		$stateProvider
			.state('profile', {
				url: '/profile',
				templateUrl: 'app/profile/profile.html',
				controller: 'ProfileCtrl',
				controllerAs: 'pc'
			});
	}
})();
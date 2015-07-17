;(function (){
'use strict'
angular
	.module('GymJournal.profile', ['ngRoute'])
	.config(ProfileConfig)
	.controller('ProfileCtrl', ProfileCtrl);

	ProfileCtrl.$inject = ['$scope', '$rootScope', 'authentication', 'gymfirebase', '$log', '$firebaseObject'];

	function ProfileCtrl($scope, $rootScope, authentication, gymfirebase, $log, $firebaseObject){
		
		var vm = this;

		$rootScope.curPath = 'profile';

		var curUserUid = authentication.getAuth().uid;

		// gymfirebase.getUsers().then(function(_data){
		// 	vm.users = _data;
		// });

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

		var userObj = gymfirebase.getCurUser(curUserUid);

		var curUser = $firebaseObject(userObj);

		vm.userData = '';

		curUser.$loaded().then(function(){ //когда пользователь загружен
			vm.userData  = curUser; 
		});
		
		//изменяем данные пользователя на вход Uid в БД и данные из формы
		vm.updateUser = function(){
			return gymfirebase.updateUser(curUserUid, vm.user);
		}
		

	}

	function ProfileConfig($routeProvider){
		$routeProvider
			.when('/profile', {
				templateUrl: 'app/profile/profile.html',
				controller: 'ProfileCtrl',
				controllerAs: 'vm'
			});
	}
})();
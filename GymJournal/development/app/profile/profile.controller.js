;(function (){
'use strict'
angular
	.module('GymJournal.profile', ['ui.router'])
	.controller('ProfileCtrl', ProfileCtrl);

	ProfileCtrl.$inject = ['$scope', '$rootScope', 'authentication', 'gymfirebase', '$log', 'getCurrentUser'];

	function ProfileCtrl($scope, $rootScope, authentication, gymfirebase, $log, getCurrentUser){
		
		var vm = this;

		vm.user = {
			name: null,
			lastname: null,
			email: null,
			height: null,
			weight: null,
			image: null,
			age: null
		}

		vm.imagePath = '';
		vm.imageData = null;
		vm.isImage = false;

		vm.updateUser = updateUser;
		vm.updateImage = updateImage;

		getUserInfo();

		$scope.$on('changed-file', function(e, data) {
			
			vm.imageData = data;

			var reader = new window.FileReader();
				reader.readAsDataURL(data); 
				reader.onloadend = function() {
          			vm.user.image = reader.result;
			  }

			vm.isImage = true;

			$scope.$apply();
		});



		function getUserInfo() {

			getCurrentUser.getUserDataById()
			.then(function(data) {

				if(data.accessToken){
					vm.user.name = data.firstName;
					vm.user.lastname = data.lastName;
					vm.user.image = data.avatar;
				}else{
					vm.user.name = data.name;
					vm.user.lastname = data.lastname;
					vm.user.email = data.email;
					vm.user.height = data.height;
					vm.user.weight = data.weight;
					vm.user.age = data.age;
					vm.user.image = data.image;
				}
				
			});

		}

		function updateImage() {
			getCurrentUser.saveUserImage(vm.imageData)
			.then(function(url) {
				vm.isImage = true;
				vm.imagePath = url;
			});
		}

		//изменяем данные пользователя, на вход Uid в БД и данные из формы
		function updateUser(){
			console.log($rootScope.userData.uid, vm.user);
			getCurrentUser.updateUserInfo($rootScope.userData.uid, vm.user);
		}
	}

})();
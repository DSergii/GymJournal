;(function(){
'use strict'

	angular
		.module('GymJournal.login', [
				'ngRoute',
				'firebase'
			])
		.constant('SERVER_URL')
		.controller('AuthCtrl', AuthController)
		.controller('StatusCtrl', StatusController)

function StatusController($scope, $rootScope, $log, authentication, gymfirebase, $state, getCurrentUser){

	var vm = this;

	vm.userData = {}

	getCurrentUser.getUserInfo()
	.then(function(data) {
		vm.userData = data;
		$rootScope.userData = data;
		$rootScope.signIn = true;

	});
	//console.log($rootScope);
	vm.getEmail = function(){
		return authentication.getEmail();
	}

	vm.getUsername = function(){
		return authentication.getUsername();
	}

	vm.logout = function(){
		authentication.signOut();
		//vm.userData = null;
		$rootScope.signIn = false;
		$rootScope.userData = null;
		$state.go('home');
	}

}

function AuthController($scope, $rootScope, $log, $cookies, authentication, getCurrentUser){

	var vm = this;

	vm.login = login;
	vm.register = register;
	vm.googleLogin = googleLogin;
	vm.facebookLogin = facebookLogin;
	vm.gitHubLogin = gitHubLogin;

	vm.credentials = {
		email: null,
		password: null
	}

	vm.newUser = {
		email: null,
		password: null
	}
	
	function login() {

		authentication.login(vm.credentials);

		getCurrentUser.getUserInfo()
		.then(function(data) {
			vm.userData = data;
			console.log(100500);
			console.log(data);
			$rootScope.userData = data;
			$rootScope.signIn = true;

		});
	}

	function register() {
		authentication.register(vm.newUser);
	}

	function googleLogin() {
		authentication.googleLogin()
		.then( function(user) {

			$rootScope.userData = getUserInfo(user);
			$rootScope.signIn = true;
			
		});
	}

	function facebookLogin() {
		authentication.facebookLogin()
		.then( function(user) {

			$rootScope.userData = getUserInfo(user);
			$rootScope.signIn = true;

		});
	}

	function gitHubLogin() {
		authentication.gitHubLogin()
		.then( function(user) {

			$rootScope.userData = getUserInfo(user);
			$rootScope.signIn = true;

		});
	}

	function getUserInfo(user) {

		var userObj = {}

		if (user) {

			if(user.providerData.length) {

				if(user.providerData[0].providerId === 'password') {

					userObj.data = user.providerData[0];
					userObj.uid = user.uid;

				} else {
					userObj.data = user.providerData[0];
				}	

			}

		}

		return userObj.data;
	}
}


})();

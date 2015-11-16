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
		//.factory('Auth', AuthFactory)


function StatusController($scope, $log, authentication, FIREBASE_URL, $firebaseObject, $firebaseArray, gymfirebase){

	var vm = this;

	var curUserUid = authentication.getAuth().uid;
	
	var userObj = gymfirebase.getCurUser(curUserUid);

	var curUser = $firebaseObject(userObj);

	var ref = new Firebase(FIREBASE_URL);

	var usersRef = ref.child('users');

	//var aaa = usersRef.child( curUserUid );

	var authData = ref.getAuth();


	vm.userData = '';

	curUser.$loaded().then(function(){ //когда пользователь загружен
		vm.userData  = authData; 
		console.log(vm.userData.facebook);
	});

	vm.getEmail = function(){
		return authentication.getEmail();
	}

	vm.getUsername = function(){
		return authentication.getUsername();
	}

	vm.logout = function(){
		authentication.logout();
	}

}

function AuthController($scope, $log, $cookies, authentication){

	var vm = this;

	vm.credentials = {
		email: null,
		password: null
	}

	vm.newUser = {
		firstname: null,
		lastname: null,
		email: null,
		password: null
	}
	
	vm.login = function(){
		authentication.login(vm.credentials);
	}

	vm.register = function(){
		authentication.register(vm.newUser);
	}

	vm.googleLogin = function(){
		authentication.googleLogin();
	}

	vm.facebookLogin = function(){
		authentication.facebookLogin();
	}
	/*vm.login = function(){
		$log.debug('Login');
		Auth.login(vm.credentials.username, vm.credentials.password);
	}

	vm.username = function(){
		return Auth.getUsername();
	}*/
}

/*function AuthFactory($http, SERVER_URL){
	var auth = {};

	auth.login = function(_username, _password){
		var auth_url = SERVER_URL;
		return $http.get(auth_url)
			.then(function(responce){
				if(responce.data.status == 'success'){
					$cookies.put('auth_token', responce.data.auth_token);
					$cookies.put('user_id', responce.data.id);
					$cookies.put('user_name', _username);
					auth.user = {
						username: _username,
						id: responce.data.id
					}
				}
				$log.debug('Loged in', responce);
				
			})
	}

	auth.getUsername = function(){
		if(auth.user && auth.username){
			return auth.user.username;
				return null;
		}
	}

	auth.logout = function(){
		return $http.get()
			.then(function(responce){
				if(responce.data.status == 'success'){
					$cookies.remove('auth_token');
					$cookies.remove('user_id');
					$cookies.remove('user_name');
					auth.user = null;
				}

			});
	}

	return auth;
}*/


})();

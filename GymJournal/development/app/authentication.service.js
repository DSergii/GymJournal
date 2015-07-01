;(function(){
'use strict'

	angular
		.module('Authentication', [
				'firebase'
			])
		.factory('authentication', AuthenticationFactory)




		function AuthenticationFactory($firebaseAuth, $firebaseObject, $rootScope, FIREBASE_URL, $log ){

			// получение ссылки на нашу БД 
			var ref = new Firebase(FIREBASE_URL)

			var auth = $firebaseAuth(ref);

			function authCallback(authData){
				if(authData){
					var userRef = ref.child('users').child(authData.uid);
					var user = $firebaseObject(userRef);
					user.$loaded().then(function(){
						$rootScope.currentUser = user;
					});
				}else{
					$rootScope.currentUser = null;
				}	
			}

			ref.onAuth(authCallback);

			function authHandle(error, authData){
				if(error){
					console.log('Auth failed!', error);
				}else{
					console.log('Auth successfuly!', authData);
				}
			}

			var	authObj = {

				login: function(_user, authHndl){
					authHndl = typeof authHndl !== 'undefined' ? authHndl : authHandle;

					ref.authWithPassword(_user, authHndl);
				},

				logout: function(){
					ref.unauth();
				},

				signedIn: function(){
					return !!ref.getAuth();
				},

				getAuth: function(){
					return ref.getAuth();
				},
				getUsername: function(){
					//return ref.child('users').child();
				},
				getEmail: function(){
					if(authObj.signedIn())
						return ref.getAuth().password.email;
					return null;
				},
				register: function(_user){
					return auth.$createUser({
						email: _user.email,
						password: _user.password
					})
					.then(function(userData){
					var	userRef = ref.child('users').child(userData.uid);
						userRef.set({
							firstname: _user.firstname,
							lastname: _user.lastname,
							email: _user.email,
							date: Firebase.ServerValue.TIMESTAMP //дата регистрации
						});
						return auth.$authWithPassword({ //после регистрации сразу логинимся
							email: _user.email,
							password: _user.password
						});
					})
					.catch(function(error){
						$log.error('Create user error -> ', error);
					})
				}

			};

			$rootScope.signedIn = function(){
				return authObj.signedIn();
			}

			return authObj;

		}
		
})();
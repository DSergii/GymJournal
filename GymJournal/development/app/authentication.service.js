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
					var userRef = ref.child('users').child(authData.uid); // по user id получаем ссылку на пользователя из БД
					var user = $firebaseObject(userRef);
					user.$loaded().then(function(){ //когда пользователь загружен
						$rootScope.currentUser = user; // помещаем его в rootScope
					});
				}else{
					$rootScope.currentUser = null;
				}	
			}
			/*
				когда пользователь залогинен firebase генерирует событие onAuth 
				которое обрабатывается ф-цией authCallback, в которую приходит
				авторизационные данные
			*/
			ref.onAuth(authCallback); 

			function authHandle(error, authData){
				if(error){
					console.log('Auth failed!', error);
				}else{
					console.log('Auth successfuly!', authData);
				}
			}

			socialAuthHandle.$inject = ['$firebaseObject'];



			function socialAuthHandle(error, authData){
				if(error){
					console.log('social-login failed!', error);
				}else{
					console.log('social-login successfuly!', authData);
					var userRef = ref.child('users').child(authData.google.id);
					var user = $firebaseObject(userRef);
					user.$loaded(function(){ 
						if(user.email){
							userRef.child('lastActivity').set(Firebase.ServerValue.TIMESTAMP);
						}else{
							userRef.set({
								//'email': authData.google.email,
								'name': authData.google.displayName,
								'avatar': authData.google.cachedUserProfile.picture,
								'id': authData.google.id,
								'token': authData.token,
								'uid': authData.uid,
								'expires': authData.expires,
								'accessToken': authData.google.accessToken,
								'lastActivity': Firebase.ServerValue.TIMESTAMP
							});
						}

					});
				}
			}

			function fbAuthHandle(error, authData){
				if(error){
					console.log('facebook social-login failed!', error);
				}else{
					console.log('facebook social-login successfuly!', authData);
					var userRef = ref.child('users').child(authData.facebook.id);
					var user = $firebaseObject(userRef);

					user.$loaded(function(){
						if(user.email){
							userRef.child('lastActivity').set(Firebase.ServerValue.TIMESTAMP);
						}else{
							userRef.set({
								//'email': authData.facebook.email,
								'firstName': authData.facebook.cachedUserProfile.first_name,
								'lastName': authData.facebook.cachedUserProfile.last_name,
								'avatar': authData.facebook.profileImageURL,
								'id': authData.facebook.id,
								'token': authData.token,
								'uid': authData.uid,
								'expires': authData.expires,
								'accessToken': authData.facebook.accessToken,
								'lastActivity': Firebase.ServerValue.TIMESTAMP
							});
						}
					});
				}
			}

			var	authObj = {

				googleLogin: function(_user, authHndl){
					
					authHndl = typeof authHndl !== 'undefined' ? authHndl : socialAuthHandle;
					console.log(authHndl);
					ref.authWithOAuthPopup("google", authHndl);
				},

				facebookLogin: function(_user, authHndl){
					//authHndl = typeof authHndl !== 'undefined' ? authHndl : fbAuthHandle;
					ref.authWithOAuthPopup("facebook", function(error, authData) {
						remember: "sessionOnly";
  						if (error) {
							console.log("Authentication Failed!");
						}else{
							console.log("Authenticated successfully with payload");
							fbAuthHandle(error, authData);
						}
					});	
				},

				login: function(_user, authHndl){
					authHndl = typeof authHndl !== 'undefined' ? authHndl : authHandle;
					auth.$authWithPassword(_user)
						.then(function(authData){
							authHndl(authData);
						})
						.catch(function(error){
							console.log("Login whith error ", error);
						})
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
				register: function(_user){ //создаем нового пользователя
					return auth.$createUser({
						email: _user.email,
						password: _user.password
					})
					.then(function(userData){ // создаем запись в БД под нового п.
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
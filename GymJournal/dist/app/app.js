// initialize material design js
$.material.init();
(function(){
	'use strict'
	
	angular
		.module('GymJournal', [
		'ui.router',
		'firebase',
		'ngCookies',
		'ngAnimate',
		'youtube-embed',
		'chart.js',
		'Authentication',
		'GymJournal.gymfirebase.srv',
		'GymJournal.about',
		'GymJournal.contact',
		'GymJournal.main',
		'GymJournal.exercises',
		'GymJournal.statistics',
		'GymJournal.profile',
		'GymJournal.nutrition',
		'GymJournal.login',
		'GymJournal.timer',
		'GymJournal.exercises.srv',
		'GymJournal.getCurrentUser',
		'base64',
		'GymJournal.filter',
		'LocalStorageModule'
		])
		.config(gymJournalConfig)
		.run(runApplication)
		.constant('FIREBASE_URL', 'https://gymjournal.firebaseio.com/')
				
	gymJournalConfig.$inject = ['$stateProvider', '$urlRouterProvider', 'localStorageServiceProvider'];


	function runApplication($rootScope, $log, localStorageService){

		var config = {
		  	apiKey: "AIzaSyCidue7FrttTuNhnVtknPjGcRfWb8inEas",
			authDomain: "gymjournal.firebaseapp.com",
			databaseURL: "https://gymjournal.firebaseio.com",
			storageBucket: "project-2650490989829732466.appspot.com",
		};

		firebase.initializeApp(config);
		
	}
	
	function gymJournalConfig($stateProvider, $urlRouterProvider, localStorageServiceProvider){
		$urlRouterProvider.otherwise('/home');

		/* configurate localStorage */

		localStorageServiceProvider
    	.setPrefix('firebase:authUser')
	    .setStorageType('localStorage')
	    .setNotify(true, true);
	}

})();


;(function(){
	'use strict'

	angular
		.module('Authentication', [
				'firebase'
			])
		.factory('authentication', AuthenticationFactory)

		function AuthenticationFactory( $rootScope, $log, $q ){

			var deferred = $q.defer();

			var API = {
				login: login,
				signIn: signIn,
				signOut: signOut,
				googleLogin : googleLogin,
				facebookLogin: facebookLogin,
				gitHubLogin: gitHubLogin
			}

			return API;

			function login(loginData) {

				firebase.auth().signInWithEmailAndPassword(loginData.email, loginData.password).catch(function(error) {

				  	var errorCode = error.code;
				  	var errorMessage = error.message;
				  	$log.error('login failure: ', errorMessage);

				});
			}

			function signIn(signInData) {

				firebase.auth().createUserWithEmailAndPassword(signInData.email, signInData.password).catch(function(error) {

					var errorCode = error.code;
					var errorMessage = error.message;
					$log.error('signIn failure: ', errorMessage);

				});

			}

			function signOut() {

				firebase.auth().signOut().then(function() {
					$log.info('signOut successful');
				}, function(error) {
				  	$log.error('signOut failure: ', error);
				});

			}

			function googleLogin() {

				var googleProvider = new firebase.auth.GoogleAuthProvider();
				googleProvider.addScope('https://www.googleapis.com/auth/plus.login');

				firebase.auth().signInWithPopup(googleProvider).then(function(result) {

					var token = result.credential.accessToken;
					var user = result.user;
					$log.info('token ', token);
					$log.info('user ', user);
					deferred.resolve( user );

				}).catch(function(error) {

				  var errorCode = error.code;
				  var errorMessage = error.message;
				  var email = error.email;
				  var credential = error.credential;
				  $log.error('errorMessage', errorMessage);
				  deferred.reject( error );

				});

				return deferred.promise;
			}

			function facebookLogin() {

				var facebookProvider = new firebase.auth.FacebookAuthProvider();
				facebookProvider.addScope('public_profile');

				firebase.auth().signInWithPopup(facebookProvider).then(function(result) {

				  	var token = result.credential.accessToken;
				  	var user = result.user;
				  	$log.info('token ', token);
					$log.info('user ', user);
					deferred.resolve( user );

				}).catch(function(error) {

				  	var errorCode = error.code;
				  	var errorMessage = error.message;
				  	var email = error.email;
				  	var credential = error.credential;
				  	$log.error('errorMessage', errorMessage);
				  	deferred.reject( error );

				});

				return deferred.promise;
			}

			function gitHubLogin() {

				var gitHubProvider = new firebase.auth.GithubAuthProvider();
				gitHubProvider.addScope('user');

				firebase.auth().signInWithPopup(gitHubProvider).then(function(result) {

				  	var token = result.credential.accessToken;
				  	var user = result.user;
				  	$log.info('token ', token);
					$log.info('user ', user);
					deferred.resolve( user );

				}).catch(function(error) {

				  	var errorCode = error.code;
				  	var errorMessage = error.message;
				  	var email = error.email;
				  	var credential = error.credential;
				  	$log.error('errorMessage', errorMessage);
				  	deferred.reject( error );

				});

				return deferred.promise;

			}

			// получение ссылки на нашу БД 
			//var ref = new Firebase(FIREBASE_URL)

			//var auth = $firebaseAuth(ref);

			/*var auth = firebase.auth();

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
			}*/
			/*
				когда пользователь залогинен firebase генерирует событие onAuth 
				которое обрабатывается ф-цией authCallback, в которую приходит
				авторизационные данные
			*/
			//ref.onAuth(authCallback); 

			/*function authHandle(error, authData){
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
					$rootScope.$broadcast('user-login', authData);
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
					$rootScope.$broadcast('user-login', authData);
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
					//console.log(authHndl);
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

			return authObj;*/

		}
		
})();
;(function(){
'use strict'

angular
	.module('GymJournal.exercises.srv', ['firebase'])
	.service('exercisessrv', exercisessrv);

	exercisessrv.$inject = ['$q', '$rootScope'];

	function exercisessrv($q, $rootScope){

		var rootRef = firebase.database().ref();

		var deferred = $q.defer();
		
		var regexp = /\d+/g;
		
		

		this.getExercise = function(){
			rootRef.on('value', function(snapshot) {
				
				var exercises = snapshot.val().exercises;
				//console.log(exercises);
				//console.log('USER DATA ', $rootScope.userData);
				
				deferred.resolve( checkUser( exercises, $rootScope.userData ) );

			});

			return deferred.promise;
		}

		function checkUser(exercises, user) {

			var exercisesData = {};

			var count = 0;

			for( var key in exercises) {

				if(exercises.hasOwnProperty(key)) {

					if($rootScope.userData !== undefined && user !== null ){

						if(user.providerId === 'password' && exercises[key].user === $rootScope.userData.uid){
							exercisesData[count] = exercises[key].data;
							count++;
						}

						if(user.providerId !== 'password' && exercises[key].user.match(regexp)[0] === $rootScope.userData.uid) {
							exercisesData[count] = exercises[key].data;
							count++;
						}
					}
				}

			}

			return exercisesData;
		}

}
	


})();
;(function() {
	'use strict';

	angular
		.module('GymJournal.getCurrentUser', ['firebase'])
		.factory('getCurrentUser', getCurrentUser);

	function getCurrentUser($rootScope, $q, $log) {

		var auth = firebase.auth();
		

		var API = {
			getUserInfo: getUserInfo,
			getUserDataById: getUserDataById,
			updateUserInfo: updateUserInfo,
			saveUserImage: saveUserImage
		}

		return API;

		function getUserInfo() {

			var deferred = $q.defer();

			auth.onAuthStateChanged(function(user) {

				if (user) {

					if(user.providerData.length) {

						if(user.providerData[0].providerId === 'password') {
							//console.log(getUserByPassword(user));
							deferred.resolve( getUserByPassword(user) );
						}

						deferred.resolve( user.providerData[0] );
						
					}

				} else {
					//$log.error('User not define ');
					deferred.reject();
				}

			});

			return deferred.promise;
		}

		function getUserDataById() {

			var deferred = $q.defer();
			var userId = null;
			var regexp = /\d+/g;

			auth.onAuthStateChanged(function(user) {

				if(user.providerData[0].providerId === 'password') {
					userId = user.uid;
				}else if(user.providerData[0].providerId === 'github.com'){
					userId = user.providerData[0].uid;
				}else{
					userId = user.uid.match(regexp)[0];
				}

				firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
					deferred.resolve( snapshot.val() );
				});	

			});

			return deferred.promise;
		}

		function updateUserInfo(userId, data) {

		  	firebase.database().ref('users/' + userId).set({
		    	name: data.name,
		    	lastname: data.lastname,
		    	email: data.email,
				height: data.height,
				weight: data.weight,
				age: data.age,
				image: data.image
		  	});

		}

		function saveUserImage(image) {

			var deferred = $q.defer();
			//console.log( 'image - ', image );
			var storage = firebase.storage();
			var storageRef = storage.ref();
			var imagesRef = storageRef.child($rootScope.userData.uid);
			var spaceRef = imagesRef.child(image.name);
			var fileName = image.name.substr(0, image.name.lastIndexOf('.'));

			var uploadTask = storageRef.child( $rootScope.userData.uid + '/' + fileName).put(image);

			uploadTask.on('state_changed', function(snapshot){

			  console.log('snapshot ', snapshot);

			}, function(error) {

			  //console.log('error ', error);
			  deferred.reject(error);

			}, function() {

			  	var downloadURL = uploadTask.snapshot.downloadURL;

			  	deferred.resolve( downloadURL );
			  	//console.log('downloadURL ', downloadURL);

			});
			
			return deferred.promise;
		}

		function getUserByPassword(data) {

			var user = {}

			user.data = data.providerData[0];
			user.uid = data.uid;

			return user;

		}

	}



})();
;(function(){
'use strict'

	angular
		.module('GymJournal.gymfirebase.srv', ['firebase'])
		.service('gymfirebase', gymfirebase);


	gymfirebase.$inject = ['FIREBASE_URL', '$firebaseObject', '$firebaseArray', '$log'];


	function gymfirebase(FIREBASE_URL, $firebaseObject, $firebaseArray, $log){

		var dbData = this;

		/* подключение к БД */
		//var ref = new Firebase(FIREBASE_URL);

		/* получение объекта из БД */
		//var refObj = $firebaseObject(ref);

		/* получение массива из объекта БД */
		//var refArr = $firebaseArray(ref);

		/*вернет только пользователей, все равно, что добавить users в конец url ->  https://gymjournal.firebaseio.com/users */
		//var usersRef = ref.child('users');

		//var usersArr = $firebaseArray(usersRef);

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
			//$log.debug(usersLength);
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
		// refObj.$loaded(function() {
		// 	dbData.dbObj = refObj;
		// });

		/* тот же callback только в виде массива */
		// refArr.$loaded(function(){
		// 	dbData.dbArr = refArr;
		// });

	}


})();
;(function(){
'use strict'

angular
	.module('GymJournal.timer', [])
	.controller('timerCtrl', timerCtrl);

	function timerCtrl($scope, $interval){

		var t = this;
		t.min = 0;
		t.sec = 0;

		t.flag = false;
		t.flag2 = false;

		var a_short = new Audio();
		a_short.src = 'audio/pip0.wav';
		var a_long = new Audio();
		a_long.src = 'audio/pip1.wav';
		var	timer;
		t.cur = function(){
			t.min = Math.floor(t.time / 60);
			t.sec = Math.ceil(t.time % 60);
			if(t.time) t.flag = true;
		}

		t.start = function(){
			//if ( angular.isDefined(timer) ) return;
			timer = $interval(function(){
		        if(t.sec == 1 && t.min == 0 ){
					t.stop();
					a_long.play();
				} 
				if(t.sec == 0 && t.min >= 1){
					t.min--;
					t.sec = 60;
				}
				t.sec--;
				if(t.min == 0 && t.sec <= 3 && t.sec >= 1){
					a_short.play();
				}
		    },1000);
		}
		t.stop = function(){
			$interval.cancel(timer);
			t.flag2 = true;
		}
		t.updateInterval = function(){
			$interval.cancel(timer);
			t.flag = false;
			t.flag2 = false;
		}
	}
})();
;(function(){
'use strict'

angular
	.module('GymJournal.contact', ['ngRoute'])
	.controller('ContactCtrl', ContactCtrl);
	
	ContactCtrl.$inject = ['$scope', '$rootScope'];
	
	function ContactCtrl($scope, $rootScope){
		$scope.title = 'Contact';
		$rootScope.curPath = 'contact';
	}

})();
;(function() {
	'use strict';

	angular
		.module('GymJournal.contact' )
		.config(configContact);

	function configContact($stateProvider) {
		$stateProvider
			.state('contact', {
				url: '/contact',
				templateUrl: 'app/contact/contact.html',
				controller: 'ContactCtrl',
				controllerAs: 'cc'
			});
	}

})();
;(function(){
	'use strict'

angular
	.module('GymJournal.exercises', ['ui.router', 'GymJournal.login', 'youtube-embed'])
	.controller('ExercisesCtrl', ExercisesCtrl);


	//ExercisesCtrl.$inject = ['$scope', '$rootScope'];

	function ExercisesCtrl($scope, $rootScope, authentication, exercisessrv, GetMyExercises){
		var vm = this;
		$scope.title = 'Exercises';
		$rootScope.curPath = 'exercises';

		vm.exercises = {
			title: null,
			descr: null,
			link: null
		}

		vm.addExercise = function(){
			return exercisessrv.addExercise(vm.exercises, vm.authInfo.uid);
		}

		exercisessrv.getExercise().then(function(_data){
			console.log(_data);
			vm.exer = _data;
		});
		
	}

})();
;(function() {
	'use strict';

	angular
		.module('GymJournal.exercises' )
		.config(exercicsesConfig);

	function exercicsesConfig($stateProvider) {
		$stateProvider
			.state('exercises', {
				url: '/exercises',
				templateUrl: 'app/exercises/exercises.html',
				controller: 'ExercisesCtrl',
				controllerAs: 'ex',
				resolve : {
					GetMyExercises : function(exercisessrv){
						return exercisessrv.getExercise();
					}
				}
			});
	}

})();
;(function(){
'use strict'

	angular
		.module('GymJournal.main', ['ui.router', 'ngAnimate'])
		.controller('MainCtrl', MainCtrl);

		//MainCtrl.$inject = ['$scope', '$rootScope'];
		
		function MainCtrl($scope, $rootScope, FIREBASE_URL, exercisessrv, authentication){

			var vm = this;

			vm.choiseExersise = choiseExersise;
			vm.saveResult = saveResult;

			vm.exersises = {
				ex1: 'Отжимания',
				ex2: 'Приседания',
				ex3: 'Подтягивания',
				ex4: 'Жим лежа',
				ex5: 'Бег'
			}

			vm.exItem = {
				exID: null,
				fit: null,
				iteration: null,
				distance: null,
				time: null
			}

			$rootScope.curPath = 'home';

			vm.isShow = false;
			vm.isRun = false;

			function choiseExersise(e) {

				vm.exItem = {
					exID: null,
					fit: null,
					iteration: null,
					distance: null,
					timer: null
				}

				vm.exItem.exID = e.target.id;

				if( e.target.id === 'ex5' ) {
					vm.isRun = true;
					vm.isShow = false;
				}else{
					vm.isRun = false;
					vm.isShow = true;
				}
				
			}

			function saveResult() {

				var userId = $rootScope.userData.uid;
				var timestamp = new Date().getTime();
				var data = vm.exItem;

			  	firebase.database().ref('userEx/' + userId + '/' + timestamp).set({
			    	exId: data.exID,
			    	fit: data.fit,
			    	iteration: data.iteration,
			    	distance: data.distance,
			    	time: data.timer
			  	});

			}

		}

})();

;(function() {
	'use strict';

	angular
		.module('GymJournal.main')
		.config(mainConfig);

	function mainConfig($stateProvider){
		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: 'app/main/main.html',
				controller: 'MainCtrl',
				controllerAs: 'mc'
			});
	}

})();
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

;(function (){
'use strict'
angular
	.module('GymJournal.nutrition', ['ui.router', 'ngAnimate'])
	.controller('NutritionCtrl', NutritionCtrl);

	NutritionCtrl.$inject = ['$scope', '$rootScope', '$http'];

	function NutritionCtrl($scope, $rootScope, $http){

		$rootScope.curPath = 'nutrition';

		$http.get('app/nutrition.json').success(function(data) {
			//console.log(data)
			$scope.article = data;
			
		});
		
	}

})();
;(function() {
	'use strict';

	angular
		.module('GymJournal.nutrition')
		.config(nutritionConfig);

	function nutritionConfig($stateProvider) {
		$stateProvider
			.state('nutrition', {
				url: '/nutrition',
				templateUrl: 'app/nutrition/nutrition.html',
				controller: 'NutritionCtrl',
				controllerAs: 'nc'
			});
	}

})();
;(function() {
	'use strict';

	angular
		.module('GymJournal')
		.directive('fileUpload', fileUpload);

	function fileUpload(){

		return {
			restrict: 'A',
			scope: true,
			link: function(scope, element, attrs){

				element.bind('change', function(e) {
					scope.$emit('changed-file', e.target.files[0]);
				});
			}
		}
	}


})();
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
;(function() {
	'use strict';

	angular
		.module('GymJournal.profile')
		.config(profileConfig);

	function profileConfig($stateProvider){
		$stateProvider
			.state('profile', {
				url: '/profile',
				templateUrl: 'app/profile/profile.html',
				controller: 'ProfileCtrl',
				controllerAs: 'pc'
			});
	}

})();
;(function() {
	'use strict';

	angular
		.module('GymJournal.filter', [])
		.filter('exersisesTitle', function() {
			return function(ID) {

				var res = null;
				var object = {
					ex1: 'Отжимания',
					ex2: 'Приседания',
					ex3: 'Подтягивания',
					ex4: 'Жим лежа',
					ex5: 'Бег'
				}

				if(ID in object) {
					res = object[ID];
				}

				return res;
			}
		});

})();
;(function (){
'use strict'
angular
	.module('GymJournal.statistics', ['ui.router', 'chart.js', 'GymJournal.filter'])
	.controller('StatisticCtrl', StatisticCtrl);

	StatisticCtrl.$inject = ['$scope', '$rootScope'];

	function StatisticCtrl($scope, $rootScope){

		var vm = this;
		var auth = firebase.auth();

		$scope.title = 'Мои результаты';

		$rootScope.curPath = 'statistics';

		vm.labels = ["January", "Fabruary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "Desember"];

		vm.data =  [
			[65, 59, 80, 81, 56, 55, 40],
    		[28, 48, 40, 19, 86, 27, 90]
    	];

		vm.exObj = {}

		getExersises();

		function getExersises() {

			var userId = null;

			auth.onAuthStateChanged(function(user) {

				if(user.providerData[0].providerId === 'password') {

					userId = user.uid;

				} else {

					userId = user.providerData[0].uid;

				}

				firebase.database().ref('userEx/' + userId ).once('value').then(function(snapshot) {
					vm.exObj = snapshot.val();
					$scope.$apply();
				});

			});
		}

	}
	
})();
;(function() {
	'use strict';

	angular
		.module('GymJournal.statistics')
		.config(statisticsConfig)


	function statisticsConfig($stateProvider){
		$stateProvider
			.state('statistics',
			 {
				url: '/statistics',
				templateUrl: 'app/statistics/statistics.html',
				controller: 'StatisticCtrl',
				controllerAs: 'sc'
			});
	}

})();
;(function(){
	'use strict';

	angular
		.module('GymJournal.about', ['ui.router'])
		.controller('AboutCtrl', AboutCtrl);
		
		AboutCtrl.$inject = ['$scope', '$rootScope'];
		
		function AboutCtrl($scope, $rootScope){

			var vm = this;
			$rootScope.curPath = 'about';
		}
	
})();
;(function() {
	'use strict';

	angular
		.module('GymJournal.about' )
		.config(configAbout);

	function configAbout($stateProvider) {
		$stateProvider
			.state('about', {
				url: '/about',
				templateUrl: 'app/about/about.html',
				controller: 'AboutCtrl',
				controllerAs: 'ac'
			});
	}

})();
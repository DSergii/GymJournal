// initialize material design js
$.material.init();
(function(){
	'use strict'
	
	angular
		.module('GymJournal', [
		'ngRoute',
		'firebase',
		'ngCookies',
		'Authentication',
		'GymJournal.gymfirebase.srv',
		'GymJournal.about',
		'GymJournal.contact',
		'GymJournal.main',
		'GymJournal.exercises',
		'GymJournal.statistics',
		'GymJournal.profile',
		'GymJournal.playlist',
		'GymJournal.nutrition',
		'GymJournal.login',
		'GymJournal.timer',
		])
		.config(gymJournalConfig)
		.constant('FIREBASE_URL', 'https://gymjournal.firebaseio.com/')
		.controller('AppCtrl', AppCtrl)
				
	gymJournalConfig.$inject = ['$routeProvider', '$locationProvider'];


	function AppCtrl($scope, $rootScope){

	}
	
	function gymJournalConfig($routeProvider, $locationProvider){
		$routeProvider.
			otherwise({redirectTo: '/'});
		$locationProvider.html5Mode(false);
	}
})();


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
								'email': authData.google.email,
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

			var	authObj = {

				googleLogin: function(_user, authHndl){
					
					authHndl = typeof authHndl !== 'undefined' ? authHndl : socialAuthHandle;
					ref.authWithOAuthPopup("google", authHndl, {
						scope: "profile,\
								email"
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
;(function(){
'use strict'

angular
	.module('GymJournal.timer', [])
	.controller('timerCtrl', timerCtrl);

	function timerCtrl($scope){

		var t = this;

		t.min = 0;
		t.sec = 0;
		t.secc = 0;

		t.flag = false;
		// ДОРАБОТАТЬ НАПИЛЬНИКОМ
		t.cur = function(){
			t.min = Math.floor(t.time / 60);
			t.sec = t.time % 60;
			t.secc = t.time - t.sec;
			if(t.time) t.flag = true;
		}

		t.start = function(){
			var	timer = setInterval(function(){
		        if(t.min > 0){
		            t.min--;
		        }else{
		            t.secc--;
		            if(t.secc == 0) clearInterval(timer);
		        }
		    },1000);
		}

	}



})();
;(function(){
'use strict'

angular
	.module('GymJournal.about', ['ngRoute'])
	.config(['$routeProvider', configAbout])
	.controller('AboutCtrl', AboutCtrl);
	
	AboutCtrl.$inject = ['$scope', '$rootScope', 'gymfirebase'];
	
	function AboutCtrl($scope, $rootScope, gymfirebase){

		var vm = this;

		vm.title = 'Page About';
		$rootScope.curPath = 'about';

		gymfirebase.getUsers().then(function(_data){
			vm.users = _data;
		});

		vm.user = {
			name: null,
			age: 0
		}

		vm.addUser = function(){
		 	gymfirebase.addUser(vm.user);
		}
			

	}
	
	function configAbout($routeProvider){
		$routeProvider.
			when('/about', {
				templateUrl: 'app/about/about.html',
				controller: 'AboutCtrl',
				controllerAs: 'vm'
			});
	}
})();
;(function(){
	'use strict'

angular
	.module('GymJournal.exercises', ['ngRoute', 'GymJournal.login'])
	.config(ConfigExercicses)
	.controller('ExercisesCtrl', ExercisesCtrl);


	//ExercisesCtrl.$inject = ['$scope', '$rootScope'];

	function ExercisesCtrl($scope, $rootScope, authentication){
		var vm = this;
		$scope.title = 'Exercises';
		$rootScope.curPath = 'exercises';

		vm.authInfo = authentication.getAuth();

		vm.exArr = [];
		//тут надо сохранять в БД
		vm.addExercise = function(_title){
			vm.exArr.push({title:_title});
		}


	}

	function ConfigExercicses($routeProvider){
		$routeProvider
			.when('/exercises', {
				templateUrl: 'app/exercises/exercises.html',
				controller: 'ExercisesCtrl',
				controllerAs: 'vm',
				/*resolve: {
					user: function(Auth, $q){
						return Auth.getUsername	|| $q.reject({unAuthorized: true})
					}
				}*/
			});
	}


})();
;(function(){
'use strict'

	angular
		.module('GymJournal.main', ['ngRoute'])
		.config(configMain)
		.controller('MainCtrl', MainCtrl);

		MainCtrl.$inject = ['$scope', '$rootScope'];
		
		function MainCtrl($scope, $rootScope){

			var vm = this;

			vm.title = 'Main';
			$rootScope.curPath = 'home';

		}

		function configMain($routeProvider){
			$routeProvider
				.when('/home', {
					templateUrl: 'app/main/main.html',
					controller: 'MainCtrl',
					controllerAs: 'vm'
				});
		}

})();

;(function(){
'use strict'

	angular
		.module('GymJournal.login', [
				'ngRoute'

			])
		.constant('SERVER_URL')
		.controller('AuthCtrl', AuthController)
		.controller('StatusCtrl', StatusController)
		//.factory('Auth', AuthFactory)


function StatusController($scope, $log, authentication){

	var vm = this;

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

;(function (){
'use strict'
angular
	.module('GymJournal.nutrition', ['ngRoute'])
	.config(NutritionConfig)
	.controller('NutritionCtrl', NutritionCtrl);

	NutritionCtrl.$inject = ['$scope', '$rootScope'];

	function NutritionCtrl($scope, $rootScope){
		$scope.title = 'Nutrition';
		$rootScope.curPath = 'nutrition';
	}

	function NutritionConfig($routeProvider){
		$routeProvider
			.when('/nutrition', {
				templateUrl: 'app/nutrition/nutrition.html',
				controller: 'NutritionCtrl'
			});
	}
})();
;(function(){
'use strict'

angular
	.module('GymJournal.playlist', ['ngRoute'])
	.config( PlaylistConfig )
	.controller('PlayListCtrl', PlayListCtrl);
	
	PlayListCtrl.$inject = ['$scope', '$rootScope'];
	
	function PlayListCtrl($scope, $rootScope){
		$scope.title = 'PlayList';
		$rootScope.curPath = 'playlist';
	}
	
	function PlaylistConfig($routeProvider){
		$routeProvider
			.when('/playlist', {
				templateUrl: 'app/playlist/playlist.html',
				controller: 'PlayListCtrl'
			});
	}
})();
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
;(function (){
'use strict'
angular
	.module('GymJournal.statistics', ['ngRoute'])
	.config(StatisticsConfig)
	.controller('StatisticCtrl', StatisticCtrl);

	StatisticCtrl.$inject = ['$scope', '$rootScope'];

	function StatisticCtrl($scope, $rootScope){
		$scope.title = 'Statistics';
		$rootScope.curPath = 'statistics';
	}

	function StatisticsConfig($routeProvider){
		$routeProvider
			.when('/statistics', {
				templateUrl: 'app/statistics/statistics.html',
				controller: 'StatisticCtrl'
			});
	}
})();
;(function(){
'use strict'

angular
	.module('GymJournal.contact', ['ngRoute'])
	.config( configContact )
	.controller('ContactCtrl', ContactCtrl);
	
	ContactCtrl.$inject = ['$scope', '$rootScope'];
	
	function ContactCtrl($scope, $rootScope){
		$scope.title = 'Contact';
		$rootScope.curPath = 'contact';
	}
	
	function configContact($routeProvider){
		$routeProvider
			.when('/contact', {
				templateUrl: 'app/contact/contact.html',
				controller: 'ContactCtrl'
			});
	}
})();
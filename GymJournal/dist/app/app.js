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
		])
		.config(gymJournalConfig)
		.constant('FIREBASE_URL', 'https://gymjournal.firebaseio.com/')
		.controller('AppCtrl', AppCtrl)
				
	gymJournalConfig.$inject = ['$stateProvider', '$urlRouterProvider'];


	function AppCtrl($scope, $rootScope){

	}
	
	function gymJournalConfig($stateProvider, $urlRouterProvider){
		$urlRouterProvider.otherwise('/home');
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
;(function(){
'use strict'

angular
	.module('GymJournal.exercises.srv', ['firebase'])
	.service('exercisessrv', exercisessrv);

	exercisessrv.$inject = ['FIREBASE_URL', '$firebaseArray', '$firebaseObject', 'authentication'];

	function exercisessrv(FIREBASE_URL, $firebaseArray, $firebaseObject, authentication){

		var exData = this;

		var ref = new Firebase(FIREBASE_URL);

		var exRef = ref.child('exercises');

		var refObj = $firebaseObject(ref); //$firebaseObject - не позволяет работать с ng-repeat

		var exArr = $firebaseArray(exRef); //$firebaseArray - позволяет работать с ng-repeat
		//console.log(refObj.child('exersises'));
		this.addExercise = function(_exersises, _id){
			var exLength = $firebaseObject(ref.child('OptionsEx').child('exLength'));
			exLength.$loaded(function(){
				var eLength = exLength.$value++;
				exLength.$save();
				exRef.child(eLength).set({"data" : _exersises, "user" : _id});
			});
			//exRef.child(_exersises).set(_id);
			//var exLength = $firebaseObject(ref.child())...2015.06.13_2 1:51:31
			//закончил на 1:25
		}

		this.getExercise = function(){
			return exArr.$loaded(function(_data){
				return _data;
			});
		}		
			//	});
			//return exArr.child(_data); //т.к. загрузка асинхронная, то $loaded возвращает промис
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
	.module('GymJournal.exercises', ['ui.router', 'GymJournal.login', 'youtube-embed'])
	.config(ConfigExercicses)
	.controller('ExercisesCtrl', ExercisesCtrl);


	//ExercisesCtrl.$inject = ['$scope', '$rootScope'];

	function ExercisesCtrl($scope, $rootScope, authentication, exercisessrv, $firebaseObject, GetMyExercises){
		var vm = this;
		$scope.title = 'Exercises';
		$rootScope.curPath = 'exercises';

		vm.authInfo = authentication.getAuth();
		vm.exArr = exercisessrv.getExercise();
		vm.exercises = {
			title: null,
			descr: null,
			link: null
		}
		vm.addExercise = function(){
			return exercisessrv.addExercise(vm.exercises, vm.authInfo.uid);
		}
		console.log(GetMyExercises);
		vm.exer = GetMyExercises;
		// exercisessrv.getExercise().then(function(_data){
		// 	vm.exer = _data;
		// });
		
	}

	function ConfigExercicses($stateProvider){
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
	.module('GymJournal.about', ['ui.router'])
	.config(['$stateProvider', configAbout])
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
	
	function configAbout($stateProvider){
		$stateProvider.
			state('about', {
				url: '/about',
				templateUrl: 'app/about/about.html',
				controller: 'AboutCtrl',
				controllerAs: 'ac'
			});
	}
})();
;(function(){
'use strict'

	angular
		.module('GymJournal.main', ['ui.router', 'ngAnimate'])
		.config(configMain)
		.controller('MainCtrl', MainCtrl);

		//MainCtrl.$inject = ['$scope', '$rootScope'];
		
		function MainCtrl($scope, $rootScope, FIREBASE_URL, exercisessrv, authentication){

			var vm = this;

			vm.approach = 1;
			vm.mass = [1];
			vm.apprMass = [];
			vm.countApr;

			$rootScope.curPath = 'home';

			vm.exer = '';
			exercisessrv.getExercise().then(function(_data){
				vm.exer = _data;
			});

			vm.addApproach = function(){
				vm.approach++;
				vm.mass.push(vm.approach);
			};

			vm.saveEquipmentApproach = function(){
				vm.apprMass.push(vm.countApr);
				console.log(vm.apprMass);
				vm.countApr = '';
			};

		}

		function configMain($stateProvider){
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
		//.factory('Auth', AuthFactory)


function StatusController($scope, $rootScope, $log, authentication, FIREBASE_URL, $firebaseObject, $firebaseArray, gymfirebase){

	var vm = this;

	var ref = new Firebase(FIREBASE_URL);
	var authData = ref.getAuth();
	if(authData !== null){
		var curUserUid = authentication.getAuth().uid;
		var userObj = gymfirebase.getCurUser(curUserUid);
		var curUser = $firebaseObject(userObj);
		curUser.$loaded().then(function(){ //когда пользователь загружен
			vm.userData  = authData; 
		});
	}
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

;(function (){
'use strict'
angular
	.module('GymJournal.nutrition', ['ui.router', 'ngAnimate'])
	.config(NutritionConfig)
	.controller('NutritionCtrl', NutritionCtrl);

	NutritionCtrl.$inject = ['$scope', '$rootScope', '$http'];

	function NutritionCtrl($scope, $rootScope, $http){

		$rootScope.curPath = 'nutrition';

		$http.get('app/nutrition.json').success(function(data) {
			$scope.article = data;
		});
		
	}

	function NutritionConfig($stateProvider){
		$stateProvider
			.state('nutrition', {
				url: '/nutrition',
				templateUrl: 'app/nutrition/nutrition.html',
				controller: 'NutritionCtrl',
				controllerAs: 'nc'
			});
	}
})();
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
;(function (){
'use strict'
angular
	.module('GymJournal.statistics', ['ui.router', 'chart.js'])
	.config(StatisticsConfig)
	.controller('StatisticCtrl', StatisticCtrl);

	StatisticCtrl.$inject = ['$scope', '$rootScope'];

	function StatisticCtrl($scope, $rootScope){
		var vm = this;
		$scope.title = 'Statistics';
		$rootScope.curPath = 'statistics';

		vm.labels = ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"];

		vm.data = [
		    [65, 59, 80, 81, 56, 55, 40],
		    [28, 48, 40, 19, 86, 27, 90]
		];
		vm.onClick = function (points, evt) {
		    console.log(points, evt);
		};
	}

	function StatisticsConfig($stateProvider){
		$stateProvider
			.state('statistics', {
				url: '/statistics',
				templateUrl: 'app/statistics/statistics.html',
				controller: 'StatisticCtrl',
				controllerAs: 'sc'
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
	
	function configContact($stateProvider){
		$stateProvider
			.state('contact', {
				url: '/contact',
				templateUrl: 'app/contact/contact.html',
				controller: 'ContactCtrl',
				controllerAs: 'vm'
			});
	}
})();
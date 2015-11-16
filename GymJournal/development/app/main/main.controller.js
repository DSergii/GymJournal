;(function(){
'use strict'

	angular
		.module('GymJournal.main', ['ngRoute', 'ngAnimate'])
		.config(configMain)
		.controller('MainCtrl', MainCtrl)
		.directive('userCountBox', userCountBox);

		//MainCtrl.$inject = ['$scope', '$rootScope'];
		
		function MainCtrl($scope, $rootScope, FIREBASE_URL, exercisessrv, authentication){

			var vm = this;

			vm.title = 'Main';
			$rootScope.curPath = 'home';

			vm.exer = '';
			exercisessrv.getExercise().then(function(_data){
				vm.exer = _data;
			});

			vm.count = {
				access: 0
			};
			

		}
		function userCountBox(){
			restrict: 'AE';
			return {
				link: function(scope, element, attrs) {
	               console.log(element);
	               console.log(attrs);
	               	scope.$watch(attrs.userCountBox,function(value){
                    	for (var i = 0; i < value.length; i++) {
                    		console.log(i);
                    	};
                	});
	            }
			}
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

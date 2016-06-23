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

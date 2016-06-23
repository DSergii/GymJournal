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
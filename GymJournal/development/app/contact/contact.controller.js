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
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


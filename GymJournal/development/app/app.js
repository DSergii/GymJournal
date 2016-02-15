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


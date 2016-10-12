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
		.config(firebaseConfig)
		//.run(runApplication)
		.constant('FIREBASE_URL', 'https://gymjournal.firebaseio.com/')
				
	gymJournalConfig.$inject = ['$stateProvider', '$urlRouterProvider', 'localStorageServiceProvider'];


	function firebaseConfig(){

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


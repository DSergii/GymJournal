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
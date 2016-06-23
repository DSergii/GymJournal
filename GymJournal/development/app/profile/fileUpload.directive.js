;(function() {
	'use strict';

	angular
		.module('GymJournal')
		.directive('fileUpload', fileUpload);

	function fileUpload(){

		return {
			restrict: 'A',
			scope: true,
			link: function(scope, element, attrs){

				element.bind('change', function(e) {
					scope.$emit('changed-file', e.target.files[0]);
				});
			}
		}
	}


})();
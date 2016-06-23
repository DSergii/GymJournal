;(function() {
	'use strict';

	angular
		.module('GymJournal.filter', [])
		.filter('exersisesTitle', function() {
			return function(ID) {

				var res = null;
				var object = {
					ex1: 'Отжимания',
					ex2: 'Приседания',
					ex3: 'Подтягивания',
					ex4: 'Жим лежа',
					ex5: 'Бег'
				}

				if(ID in object) {
					res = object[ID];
				}

				return res;
			}
		});

})();
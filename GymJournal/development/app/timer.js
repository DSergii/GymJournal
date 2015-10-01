;(function(){
'use strict'

angular
	.module('GymJournal.timer', [])
	.controller('timerCtrl', timerCtrl);

	function timerCtrl($scope, $interval){

		var t = this;
		t.min = 0;
		t.sec = 0;

		t.flag = false;
		t.flag2 = false;

		var a_short = new Audio();
		a_short.src = 'audio/pip0.wav';
		var a_long = new Audio();
		a_long.src = 'audio/pip1.wav';
		var	timer;
		t.cur = function(){
			t.min = Math.floor(t.time / 60);
			t.sec = Math.ceil(t.time % 60);
			if(t.time) t.flag = true;
		}

		t.start = function(){
			//if ( angular.isDefined(timer) ) return;
			timer = $interval(function(){
		        if(t.sec == 1 && t.min == 0 ){
					t.stop();
					a_long.play();
				} 
				if(t.sec == 0 && t.min >= 1){
					t.min--;
					t.sec = 60;
				}
				t.sec--;
				if(t.min == 0 && t.sec <= 3 && t.sec >= 1){
					a_short.play();
				}
		    },1000);
		}
		t.stop = function(){
			$interval.cancel(timer);
			t.flag2 = true;
		}
		t.updateInterval = function(){
			$interval.cancel(timer);
			t.flag = false;
			t.flag2 = false;
		}
	}
})();
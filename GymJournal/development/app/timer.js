;(function(){
'use strict'

angular
	.module('GymJournal.timer', [])
	.controller('timerCtrl', timerCtrl);

	function timerCtrl($scope){

		var t = this;

		t.min = 0;
		t.sec = 0;
		t.secc = 0;

		t.flag = false;
		// ДОРАБОТАТЬ НАПИЛЬНИКОМ
		t.cur = function(){
			t.min = Math.floor(t.time / 60);
			t.sec = t.time % 60;
			t.secc = t.time - t.sec;
			if(t.time) t.flag = true;
		}

		t.start = function(){
			var	timer = setInterval(function(){
		        if(t.min > 0){
		            t.min--;
		        }else{
		            t.secc--;
		            if(t.secc == 0) clearInterval(timer);
		        }
		    },1000);
		}

	}



})();
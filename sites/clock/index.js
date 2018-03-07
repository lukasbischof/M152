var hourFirst, hourSecond, minuteFirst, minuteSecond, secondFirst, secondSecond;
var rounds = new Array();
var per = new Array();
var titles;

function init() {
	hourFirst = document.getElementById('hourFirst');
	hourSecond = document.getElementById('hourSecond');
	minuteFirst = document.getElementById('minuteFirst');
	minuteSecond = document.getElementById('minuteSecond');
	secondFirst = document.getElementById('secondFirst');
	secondSecond = document.getElementById('secondSecond');
	
	titles = ['hourFirst', 'hourSecond', 'minuteFirst', 'minuteSecond', 'secondFirst', 'secondSecond'];
	rounds = [1,1,1,1,1,1];
	per = [1,1,1,1,1,1];
	
	setSegments();
	startMonitoringSignificantTimeUpdates();
}

function startMonitoringSignificantTimeUpdates() {
	window.setInterval(function(){
		var date = new Date;
		var seconds = date.getSeconds();
		var minutes = date.getMinutes();
		var hours = date.getHours();
		var hf = (Math.floor(hours / 10)) * 36;
		var hs = (hours % 10) * 36;
		var mf = (Math.floor(minutes / 10)) * 36;
		var ms = (minutes % 10) * 36;
		var sf = (Math.floor(seconds / 10)) * 36;
		var ss = (seconds % 10) * 36;
		var times = [hf, hs, mf, ms, sf, ss];
		
		for (var i = 0; i < titles.length; i++) {
			if (times[i] > 0) {
				document.getElementById(titles[i]).style.webkitTransform = "rotateX(" + (times[i] + rounds[i]) + "deg)";
				per[i] = 1;
			} else {
				if (per[i] == 1) {
					rounds[i] += 360;
					per[i] = 0;
				}
				
				document.getElementById(titles[i]).style.webkitTransform = "rotateX(" + (times[i] + rounds[i]) + "deg)";
			}
		}
	}, 100);
}

function setSegments() {
	for (var i = 0; i < titles.length; i++) {
		var currentRing = document.getElementById(titles[i]);
		var count = undefined;
		switch (titles[i]) {
			case 'secondSecond':
				count = 10;
			break;
			case 'secondFirst':
				count = 5;
			break;
			case 'minuteSecond':
				count = 10;
			break;
			case 'minuteFirst':
				count = 5;
			break;
			case 'hourSecond':
				count = 10;
			break;
			case 'hourFirst':
				count = 2
			break;
		}
		
		buildSegments(currentRing, count);
	}
}

function buildSegments(Ring, count) {
	for (var i = 0; i < 10; ++i) {
			var segment = document.createElement('div');
			segment.className = "segment";
			
			var angle = -i * (Math.PI * 2 / 10);
			segment.style.webkitTransform = 'rotateX(' + angle + 'rad) translateZ(170px)';
			segment.innerHTML = (i <= count) ? i : '';
			Ring.appendChild(segment);
	}
}

window.addEventListener("load", init);

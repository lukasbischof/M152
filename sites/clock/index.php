<button onclick="document.getElementById('space').webkitRequestFullscreen(); document.getElementById('cancelFullscreen').style.display = 'block'">Fullscreen</button>

<div id="space">
	<button id="cancelFullscreen" onclick="document.webkitCancelFullScreen(); this.style.display = 'none'">normal mode</button>

	<div id="hours">
		<div class="ring" id="hourFirst"></div>
		<div class="ring" style="margin-left: 110px" id="hourSecond"></div>
	</div>
	
	<div id="minutes">
		<div class="ring" style="margin-left: 250px" id="minuteFirst"></div>
		<div class="ring" style="margin-left: 360px" id="minuteSecond"></div>
	</div>
	
	<div id="seconds">
		<div class="ring" style="margin-left: 500px" id="secondFirst"></div>
		<div class="ring"  style="margin-left: 610px" id="secondSecond"></div>
	</div>
	
</div>
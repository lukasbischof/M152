var can, ctx, sun, cloud;
var X, Y; // Canvas width and height

var Point = function(x, y) {
	this.x = x;
	this.y = y;
};

var points = [];

function initCanvas() {
	can = document.getElementsByTagName("canvas")[0];
	can.width  = X = window.innerWidth;
	can.height = Y = window.innerHeight;

	ctx = can.getContext("2d");

	sun = document.getElementById("sun");
	cloud = document.getElementById("cloud");
}

function draw(maxHeight, count, roughtness) {
	points = [
		new Point(0, Y),
		new Point(X, Y)
	];

	var strength = 1;
	for (var c = 1; c <= count; c++) {
		for (var index = 1; index <= points.length - 1; index += 2) {
			var lastPoint = points[index - 1];
			var nextPoint = points[index];
			var midX = (nextPoint.x - lastPoint.x) / 2;
			var midY = (nextPoint.y - lastPoint.y) / 2;

			var x = lastPoint.x + midX;
			var y = lastPoint.y + midY + -((Math.random() - 0.1) * strength * maxHeight); // Da im canvas der 0-Y-Punkt oben liegt, geht es je höher der Y Wert ist desto tiefer herunter => Wir rechen die Zufallszahl * -1, damit wir kein Tal machen :)
			console.log(y);

			var newPoint = new Point(x, y);
			points.splice(index, 0, newPoint);

			strength /= roughtness;
		}
	}

	ctx.beginPath();
	ctx.lineWidth = 4;
	//ctx.strokeStyle = "lightgrey";
	ctx.moveTo(points[0].x, points[0].y);
	for (var i = 1; i < points.length; ++i) {
		var currentPoint = points[i];
		ctx.lineTo(currentPoint.x, currentPoint.y);
		ctx.stroke();
	}
	ctx.closePath();
	ctx.fillStyle = "green";
	ctx.fill();


	// Draw assets
	var sunOffsetX = 50,
		sunOffsetY = 30;
	ctx.drawImage(sun, X - sun.width - sunOffsetX, sunOffsetY);

	var cloudCount = 8,
		cloudMinOffsetX = 20,
		cloudMinOffsetY = 10;
	for (var i = 1; i <= cloudCount; i++) {
		var x = (X * Math.random()) - cloudMinOffsetX * 2;
		var y = ((Y / 2 - cloud.height) * Math.random()) + cloudMinOffsetY;
		ctx.drawImage(cloud, x, y);
	}
}

window.addEventListener("load", function() {
	initCanvas();
	draw(Y / 2 - 30, 12, 1.28);
});
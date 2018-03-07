var canvas, ctx;
window.addEventListener("load", function() {
    canvas = document.querySelector("canvas");
    if (!canvas)
        canvas = document.getElementsByTagName("canvas")[0];

    try {
        ctx = canvas.getContext("2d");
    } catch (e) {
        alert("Your device doesn't support canvas drawing");
        throw new Exception("no cavnas context");
    }

    updateLoop();
});

function updateLoop() {
    update();
    setTimeout(updateLoop, 10);
}

function update() {
    var startingDate = new Date("04/28/2017");
    var endDate = new Date("07/17/2017");
    var currentDate = new Date();

    var percent = (currentDate.getTime() - startingDate.getTime()) / (endDate.getTime() - startingDate.getTime());

    var mid = canvas.getBoundingClientRect().width / 2,
        startingAngle = 1.5 * Math.PI;

    ctx.clearRect(0, 0, mid * 2, mid * 2);
    ctx.beginPath();
    ctx.strokeStyle = "#efefef";
    ctx.arc(mid, mid, mid - ctx.lineWidth, 0, Math.PI * 2, true);
    ctx.stroke();
    ctx.closePath();

    var s = stringFromDiff(endDate.getTime() - currentDate.getTime());
    if (s === null) {
        ctx.strokeStyle = "lightgreen";
        s = "Ferien!";
    } else {
        ctx.strokeStyle = "#6363ff";
    }
    var a = startingAngle + ((Math.PI * 2) * percent);
    if (a - startingAngle >= Math.PI * 2) {
        a = Math.PI * 2 + startingAngle;
    }

    ctx.textAlign = "center";
    ctx.lineWidth = 18;
    ctx.beginPath();
    ctx.arc(mid, mid, mid - ctx.lineWidth, startingAngle, a, false);
    ctx.stroke();
    ctx.closePath();


    ctx.font = "27pt sans-serif";
    ctx.fillText(s, mid, mid - 30, mid * 2 - 2);

    var humanReadablePercent = percent < 1 ? ("(" + (percent * 100).toFixed(3) + "%") : "(100%";
    humanReadablePercent += " geschafft)";
    ctx.font = "24pt sans-serif";
    ctx.fillText(humanReadablePercent, mid, mid + 33, mid * 2 - 2);
};

function stringFromDiff(diff) {
    if (diff <= 0)
        return null;

    var ms = diff % 1000;
    diff = Math.floor(diff / 1000);

    var s = diff % 60;
    diff = Math.floor(diff / 60);

    var m = diff % 60;
    diff = Math.floor(diff / 60);

    var h = diff % 24;
    diff = Math.floor(diff / 24);

    var d = diff % 7;
    diff = Math.floor(diff / 7);

    var w = diff % 30;
    diff = Math.floor(diff / 30);

    if (ms < 100) {
        if (ms < 10) {
            ms = "00" + ms;
        } else
            ms = "0" + ms;
    }

    if (s < 10)
        s = "0" + s;

    return w + " W, " + d + " T, " + h + " Std, " + m + " Min, " + s + " Sec";
}

let timerId = NaN;
let count = 0;
let imglink = new Array();
for (i = 0; i < 11; i++) {
    imglink[i] = "<img src='" + i + ".png'>";
}

function startTimer() {
    timerId = setInterval(tick, 500);
}

function stopTimer() {
    clearInterval(timerId);
}

function tick() {
    document.getElementById("counter").innerHTML = imglink[count];
    count++;
    if (count == 11)
        count = 0;
}
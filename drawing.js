let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let old_x = 0;
let old_y = 0;
const widthDisplay = document.getElementById("width-display");
const slider = document.getElementById("slider");
const colorPicker = document.getElementById("color-picker");
let width = Number(slider.value);
let color = colorPicker.value;








// 線の太さ変更
slider.addEventListener("input", () => {
    width = Number(slider.value);
    widthDisplay.textContent = width;
});

// 色変更
colorPicker.addEventListener("input", () => {
    color = colorPicker.value;
});

// パレット
document.querySelectorAll(".color-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        color = btn.dataset.color;
        colorPicker.value = color;
    });
});

// 消しゴム
document.getElementById("eraser-btn").addEventListener("click", () => {
    color = "#ffffff";
});

// 全消し
document.getElementById("clear-btn").addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// canvas上で座標取得
function getCanvasPos(event){
    const rect = canvas.getBoundingClientRect();

    return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top
    };
}

function init(){
    canvas.addEventListener("touchstart", touchStart, false);
    canvas.addEventListener("touchmove", touchMove, false);
}







function touchStart(event){
    event.preventDefault();
    const pos = getCanvasPos(event);
    old_x = pos.x;
    old_y = pos.y;


    // チョン押しで点が書かれる
    ctx.beginPath();
    ctx.arc(old_x, old_y, width / 2, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

function touchMove(event){
    event.preventDefault();
    const pos = getCanvasPos(event);
    const c_x = pos.x;
    const c_y = pos.y;
    drawLine(old_x, old_y, c_x, c_y);
    old_x = c_x;
    old_y = c_y;
}

function drawLine(x1, y1, x2, y2){
    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.stroke();
}
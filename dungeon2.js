"use strict";

let W = 31;
let H = 31;
const maze = [];
let ctx;
const wallImg = new Image();
const floorImg = new Image();

//追加//
const player = new Player(1,1); 
let keyCode = 0;
let timer = NaN;

//主人公オブジェクトコンストラクタ
function Player(x, y) {

    this.x = x;
    this.y = y;
    this.dir = 1;

    this.update = function () {

        let nx = 0;
        let ny = 0;

        switch (keyCode) {

            case 37:
                nx = -1;
                this.dir = 2;
                break;

            case 38:
                ny = -1;
                this.dir = 0;
                break;

            case 39:
                nx = 1;
                this.dir = 3;
                break;

            case 40:
                ny = 1;
                this.dir = 1;
                break;
        }

        let tx = this.x + nx;
        let ty = this.y + ny;

        if (
            tx >= 0 &&
            tx < W &&
            ty >= 0 &&
            ty < H &&
            maze[ty][tx] == 0
        ) {
            this.x = tx;
            this.y = ty;
        }
    };

    this.paint = function (gc) {

        let img = document.getElementById("hero" + this.dir);

        gc.drawImage(
            img,
            this.x * 16,
            this.y * 16,
            16,
            16
        );
    };
}



function random(v) {
    return Math.floor(Math.random() * v);
}

function init() {
    reset();

    go();//新規追加
}

function go() {
    window.onkeydown = mykeydown;
    window.onkeyup = mykeyup;

    let maze = document.getElementById("maze");
    //
    maze.oncontextmenu = function (e) {
        e.preventDefault();
    };

    timer = setInterval(tick, 45);
}

function tick() {
    player.update();
    repaint();
}





function reset() {
    W = Number(document.getElementById("width").value);
    H = Number(document.getElementById("height").value);
    let maze = document.getElementById("maze");
    ctx = maze.getContext("2d");

    createMaze(W, H);
    let loaded = 0;
    function checkLoaded() {
        loaded++;
        if (loaded === 2) {
            repaint();
        }
    }
    wallImg.onload = checkLoaded;
    floorImg.onload = checkLoaded;
    wallImg.src = "brick.png";
    floorImg.src = "grass.png";
}






function createMaze(w, h) {
    maze.length = 0;

    for (let y = 0; y < h; y++) {
        maze[y] = [];
        for (let x = 0; x < w; x++) {
            maze[y][x] = x == 0 || x == w - 1 || y == 0 || y == h - 1 ? 1 : 0;
        }
    }
    for (let y = 2; y < h - 2; y += 2) {
        for (let x = 2; x < w - 2; x += 2) {
            maze[y][x] = 1;
            let dir = random(y == 2 ? 4 : 3);
            let px = x;
            let py = y;
            switch (dir) {
                case 0:
                    py++;
                    break;
                case 1:
                    px--;
                    break;
                case 2:
                    px++;
                    break;
                case 3:
                    py--;
                    break;
            }
            maze[py][px] = 1;
        }
    }
}

function repaint() {

    ctx.clearRect(0, 0, 900, 600);

    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {

            ctx.drawImage(
                floorImg,
                x * 16,
                y * 16,
                16,
                16
            );

            if (maze[y][x] == 1) {
                ctx.drawImage(
                    wallImg,
                    x * 16,
                    y * 16,
                    16,
                    16
                );
            }
        }
    }

    player.paint(ctx);
}


//
function mykeydown(e) {
    keyCode = e.keyCode;
}

function mykeyup(e) {
    keyCode = 0;
}
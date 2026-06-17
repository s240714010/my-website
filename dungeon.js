"use strict";

let W = 31;
let H = 31;

const maze = [];

let ctx;

const wallImg = new Image();
const floorImg = new Image();

function random(v) {
    return Math.floor(Math.random() * v);
}

function init() {
    reset();
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
    ctx.clearRect(0,0,900,600);

    for (let x = 0; x < W; x++) {
        for (let y = 0; y < H; y++) {
            ctx.drawImage(floorImg, x * 16, y * 16, 16, 16);
            if (maze[y][x] == 1) {
                ctx.drawImage(wallImg, x * 16, y * 16, 16, 16);
            }
        }
    }
    ctx.restore();
}
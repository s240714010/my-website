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

//ステージ//
const STATE_PLAY = 0;
const STATE_CLEAR = 1;
const STATE_GAMEOVER = 2;
let gameState = STATE_PLAY;
let startTime = 0;
let clearTime = 0;

//視点移動など//
const TILE = 48;
const VIEW_W = 12;
const VIEW_H = 9;
const HALF_W = Math.floor(VIEW_W / 2);
const HALF_H = Math.floor(VIEW_H / 2);

//敵など//
const enemyImg = new Image();
const enemies = [];
let ENEMY_COUNT = 10;

const coinImg = new Image();
const coins = [];
let COIN_COUNT = 50;
let coinCount = 0;


//主人公オブジェクトコンストラクタ
function Player(x, y) {
    this.x = x;
    this.y = y;
    this.dir = 1;
    this.update = function () {
        if (gameState != STATE_PLAY) return;
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

        //コイン取得//
        for (let i = coins.length - 1; i >= 0; i--) {
            if (
                this.x == coins[i].x &&
                this.y == coins[i].y
            ) {
                coins.splice(i, 1);
                coinCount++;
                if (coins.length == 0) {
                    clearTime = Math.floor((Date.now() - startTime) / 1000);
                    gameState = STATE_CLEAR;
                }
            }
        }

        //接敵//
        for (let j = enemies.length -1; j >= 0; j--) {
            if (
                this.x == enemies[j].x && this.y == enemies[j].y
            ) {
                enemies.splice(j, 1);
                player.stamina -= 2;
                if (player.stamina <= 0) {
                    gameState = STATE_GAMEOVER
                }
            }
        }

    };

    this.paint = function (gc) {
    let img = document.getElementById("hero" + this.dir);
    gc.drawImage(
        img,
        HALF_W * TILE,
        HALF_H * TILE,
        TILE,
        TILE
    );
};
}

// 敵オブジェクト
function Enemy(x, y) {
    this.x = x;
    this.y = y;

    this.update = function () {
        // 今は何もしない
        // 後でAIを書く
    };

    this.paint = function (gc) {

        const sx = this.x - player.x + HALF_W;
        const sy = this.y - player.y + HALF_H;

        if (
            sx >= 0 &&
            sx < VIEW_W &&
            sy >= 0 &&
            sy < VIEW_H
        ) {
            gc.drawImage(
                enemyImg,
                sx * TILE,
                sy * TILE,
                TILE,
                TILE
            );
        }
    };
}

function createEnemies() {

    enemies.length = 0;

    while (enemies.length < ENEMY_COUNT) {

        const x = random(W);
        const y = random(H);

        // 床だけ
        if (maze[y][x] != 0) continue;

        // 主人公と重ならない
        if (x == player.x && y == player.y) continue;

        // 他の敵と重ならない
        let hit = false;

        for (const e of enemies) {
            if (e.x == x && e.y == y) {
                hit = true;
                break;
            }
        }

        if (hit) continue;

        enemies.push(new Enemy(x, y));
    }
}

function Coin(x,y) {
    this.x = x;
    this.y = y;
    this.update = function () {}
    this.paint = function (gc) {
        const gx = this.x - player.x + HALF_W;
        const gy = this.y - player.y + HALF_H;
        if (
            gx >= 0 &&
            gx < VIEW_W &&
            gy >= 0 &&
            gy < VIEW_H
        ) {
            gc.drawImage(
                coinImg,
                gx * TILE + 15,
                gy * TILE + 12,
                18,
                24
            );
        }
    };
}

function createCoins() {
    coins.length = 0;
    while (coins.length < COIN_COUNT) {
        const x = random(W);
        const y = random(H);
        if (maze[y][x] !=0) continue;
        if (x == player.x && y == player.y) continue;
        let hit = false;
        for (const e of coins) {
            if (e.x == x && e.y == y) {
                hit = true;
                break;
            }
        }
        for (const enemy of enemies) {
    if (enemy.x == x && enemy.y == y) {
        hit = true;
        break;
    }
}
        if (hit) continue;
        coins.push(new Coin(x,y));
    }
}








function random(v) {
    return Math.floor(Math.random() * v);
}

//分になおす//
function formatTime(sec) {
    const min = Math.floor(sec / 60);
    const second = Math.floor(sec % 60);

    return min + "分" + String(second).padStart(2, "0") + "秒";
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
    timer = setInterval(tick, 75);
}


function tick() {
    if (gameState == STATE_PLAY) {
        player.update();
        for (const enemy of enemies) {
            enemy.update();
        }
        for (const coin of coins) {
            coin.update();
        }
    }
    repaint();
}





function reset() {
    player.stamina = 10;
    gameState = STATE_PLAY;
    coinCount = 0;
    startTime = Date.now();
    clearTime = 0;
    let maze = document.getElementById("maze");
    maze.width = VIEW_W * TILE;
    maze.height = VIEW_H * TILE;
    ctx = maze.getContext("2d");
    createMaze(W, H);
    let loaded = 0;
    function checkLoaded() {
        loaded++;
        if (loaded == 4) {
            createEnemies();
            createCoins();
            repaint();
        }
    }

    wallImg.onload = checkLoaded;
    floorImg.onload = checkLoaded;
    enemyImg.onload = checkLoaded;
    coinImg.onload = checkLoaded;

    wallImg.src = "maptile_ishizukuri_gray_01.png";
    floorImg.src = "maptile_tsuchi_01.png";
    enemyImg.src = "kaeru.png";
    coinImg.src = "coin.png";
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

    ctx.clearRect(0, 0, VIEW_W * TILE, VIEW_H * TILE);

    for (let sy = 0; sy < VIEW_H; sy++) {
        for (let sx = 0; sx < VIEW_W; sx++) {

            const mx = player.x - HALF_W + sx;
            const my = player.y - HALF_H + sy;

            if (mx < 0 || mx >= W || my < 0 || my >= H) {
                ctx.fillStyle = "black";
                ctx.fillRect(sx * TILE, sy * TILE, TILE, TILE);
                continue;
            }

            ctx.drawImage(floorImg, sx * TILE, sy * TILE, TILE, TILE);

            if (maze[my][mx] == 1) {
                ctx.drawImage(wallImg, sx * TILE, sy * TILE, TILE, TILE);
            }
        }
    }

    for (const enemy of enemies) enemy.paint(ctx);
    for (const coin of coins) coin.paint(ctx);
    player.paint(ctx);

    //コイン枚数
    ctx.fillStyle = "white";
    ctx.font = "15px sans-serif";
    ctx.textAlign = "left";

    ctx.fillText(
        "coin : " + coinCount + "/" + COIN_COUNT,
        10,
        20
    );

    //タイマー表示
    ctx.fillStyle = "white";
    ctx.font = "15px sans-serif";
    ctx.textAlign = "left";
    let nowTime;
    if (gameState == STATE_CLEAR) {
        nowTime = clearTime;
    } else {
        nowTime = Math.floor((Date.now() - startTime) / 1000);
    }

    ctx.fillText(
        "Time : " + formatTime(nowTime),
        10,
        40
    );

    //スタミナ
    ctx.fillStyle = "black";
    ctx.fillRect(
        HALF_W * TILE - 23,
        HALF_H * TILE - 10,
        100,
        8);
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(
        HALF_W * TILE - 23,
        HALF_H * TILE - 10,
        player.stamina * 10,
        8);




    //クリア//
    if (gameState == STATE_CLEAR) {

        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, VIEW_W * TILE, VIEW_H * TILE);

        ctx.fillStyle = "yellow";
        ctx.font = "48px sans-serif";
        ctx.textAlign = "center";

        ctx.fillText(
            "GAME CLEAR!",
            VIEW_W * TILE / 2,
            VIEW_H * TILE / 2
        );

        ctx.font = "24px sans-serif";

        ctx.fillText(
            "Coins : " + coinCount,
            VIEW_W * TILE / 2,
            VIEW_H * TILE / 2 + 50
        );

        ctx.fillText(
            "Time : " + formatTime(clearTime),
            VIEW_W * TILE / 2,
            VIEW_H * TILE / 2 + 90
        );
    }

    //ゲームオーバー//
    if (gameState == STATE_GAMEOVER) {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, VIEW_W * TILE, VIEW_H * TILE);

        ctx.fillStyle = "red";
        ctx.font = "48px sans-serif";
        ctx.textAlign = "center";

        ctx.fillText(
            "GAME OVER!",
            VIEW_W * TILE / 2,
            VIEW_H * TILE / 2
        );

        ctx.font = "24px sans-serif";

        ctx.fillText(
            "Coins : " + coinCount,
            VIEW_W * TILE / 2,
            VIEW_H * TILE / 2 + 50
        );
    }
}


//
function mykeydown(e) {
    keyCode = e.keyCode;
}

function mykeyup(e) {
    keyCode = 0;
}
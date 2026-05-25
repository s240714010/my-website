let blocks = ["brick", "tile", "soilwall", "stonewall"];
let block = "brick";
let w = 8;
let h = 8;

function init() {
    reset();
}

//リセットボタンとマップ範囲変更
function reset() {
    let w = Number(document.getElementById("width").value);
    let h = Number(document.getElementById("height").value);
    let b = document.getElementById("board");
    //削除
    b.innerHTML = "";
    for (let i = 0; i < h; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j < w; j++) {
            let td = document.createElement("td");
            tr.appendChild(td);
            let img = document.createElement("img");
            img.src = "grass.png";
            img.className = "grass";
            img.id = "img(" + i +"," + j + ")";
            img.onclick=clicked;
            td.appendChild(img);
        }
        b.appendChild(tr);
    }
}

function clicked(e) {
    let img = document.getElementById(e.target.id);
    //壁と通路を何度でもチェンジできるようにする
    if(img.className=="grass") {
        img.src= block + ".png";
        img.className = "block";
    }else if(img.className=="block") {
        img.src="grass.png";
        img.className = "grass";
    }
}

//壁を四種類から選べるようにした
function selectblock(hand) {
    block = blocks[hand];
}
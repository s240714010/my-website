let janken = ["グー","チョキ","パー"];
let message;
let win = 0;
let user = undefined;

function init(){
    win = 0;
    message = "";
    user = undefined
    document.getElementById("result").innerHTML = message;
}

function selectHand(hand){
    user = hand;
    document.getElementById("result").innerHTML =
    "選択中：" + janken[user];
}

function judge(){
    let comp = Math.floor(Math.random() * 3);

    if (user === undefined) {
        alert("手を選んでください");
        return;
    }

    document.getElementById("result").innerHTML = "じゃんけん・・・";

    setTimeout(function(){
    message = "ぽん！<br><br>";
    message += "あなたの手：" + janken[user] + "<br>";
    message += "コンピュータの手：" + janken[comp] + "<br>";
    
    let x = user-comp;

    if (x==0) {
        win = 3;
        message += "あいこ"
    } else if (x==-1||x==2) {
        win = 1;
        message += "勝ち"
    } else if (x==1||x==-2) {
        win = 2;
        message += "負け"
    }

    document.getElementById("result").innerHTML =  message;

    }, 1000);
}
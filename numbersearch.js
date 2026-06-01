let qno = 1;
let x = 0;
let currentQuestion = [];
let startTime = 0;
let totalQuestions = 10;

function q(){
    let dgt = [1,2,3,4,5,6,7,8,9];
    let a = Array(8);
    x = Math.floor(Math.random()*9);
    for (let i = 0, j = 0; i < 9; i++) {
        if (i != x ) {
            a[j] = dgt[i]; 
            j++;
        }
    }
    shuffle(a);
    currentQuestion = a;
}

function start(){
    qno = 1;
    document.getElementById("history").innerHTML = "";
    document.getElementById("result").innerHTML = "";
    startTime = Date.now();
    q();
}

document.addEventListener('keydown', myhandler, false);

function myhandler(event) {
    for (let i = '1'; i <= '9'; i++) {
        if (event.key == i) {
            //alert(i);
            document.getElementById("ans1").innerText = '['+i+']';
            if (i == x+1) {
                addHistory(currentQuestion, i);
                qno++;
                if (qno > totalQuestions) {
                    const endTime = Date.now();
                    const sec = (endTime - startTime) / 1000;
                    document.getElementById("result").innerText =`クリア！ ${sec} 秒`;
                    return;
                }
                q();
            }
        }
    }
}

Array.prototype.shuffle = function(){
    let i = this.length;
    while(i){
        let j = Math.floor(Math.random()*i);
        let t = this[--i];
        this[i] =this[j];
        this[j] = t;
    }
    return this;
}

function shuffle(cards){
    //let cards = [1,1,2,2,3,3,4,4,5,5,6,6];
    cards.shuffle();
    document.getElementById("question1").innerText = cards.join("　");
}

//りれき
function addHistory(question, answer) {
    const history = document.getElementById("history");

    history.innerHTML += question.join(" ") + "　" + answer + "<br>";
}
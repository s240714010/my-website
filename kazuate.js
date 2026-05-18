let r = Math.floor(Math.random() * 100) + 1;
let attempts = 0;
const maxAttempts = 10;
const button = document.getElementById("submit");



function judge() {

    const input = document.getElementById("num");
    const result = document.getElementById("result");
    const count = document.getElementById("count");

    const num = Number(input.value)

    if (num < 1 || num > 100 || isNaN(num)) {
    result.textContent = "1〜100の数字を入力してください！";
    return;
}

 attempts++;

  const diff = Math.abs(r - num);

 if (num === r) {
    result.textContent = `正解！！ 答えは ${r} でした！`;
    button.disabled = true;
    return;
  }

 if (diff <= 5) {
    result.textContent = "かなり近い！";
  } else if (diff <= 10) {
    result.textContent = "近い！";
  } else if (num < r) {
    result.textContent = "もっと大きい数字です！";
  } else {
    result.textContent = "もっと小さい数字です！";
  }

  count.textContent = `残り ${maxAttempts - attempts} 回`;

  if (attempts >= maxAttempts) {
    result.textContent = `ゲームオーバー！ 答えは ${r} でした。`;
    button.disabled = true;
  }

  input.value = "";
}
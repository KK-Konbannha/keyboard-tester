// document.addEventListener("keydown", (event) => {
//   console.log("押されたキー:", event.code);
//   if (event.code == "Space") {
//     clearActiveKeys();
//     activateKeys(...[
//       "KeyA",
//       "KeyS",
//       "KeyD",
//       "KeyF",
//       "KeyJ",
//       "KeyK",
//       "KeyL",
//       "Semicolon",
//     ]);
//     // disabledAllKeys();
//   } else if (event.code == "KeyA") {
//     enableTypingKeys();
//   }
// });

const keyboard = document.querySelector(".keyboard");

const keys = [...keyboard.querySelectorAll(".key[data-code]")];

const keysByCode = new Map(
  keys.map((key) => [key.dataset.code, key]),
);

// すべてのキーの点灯を解除する
function clearActiveKeys() {
  keyboard.querySelectorAll(".key.is-active").forEach((key) => {
    key.classList.remove("is-active");
  });
}

// すべてのキーをdisabledにする
function disabledAllKeys() {
  keys.forEach((key) => key.disabled = true);
}

// 今回対象となるキーを使用可能状態(disabledではない状態)にする
function enableTypingKeys() {
  const enabledCodes = new Set([
    // 数字・記号
    "Digit1",
    "Digit2",
    "Digit3",
    "Digit4",
    "Digit5",
    "Digit6",
    "Digit7",
    "Digit8",
    "Digit9",
    "Digit0",
    "Minus",
    "Equal",
    "IntlYen",

    // Qの行
    "KeyQ",
    "KeyW",
    "KeyE",
    "KeyR",
    "KeyT",
    "KeyY",
    "KeyU",
    "KeyI",
    "KeyO",
    "KeyP",
    "BracketLeft",
    "BracketRight",

    // Aの行
    "KeyA",
    "KeyS",
    "KeyD",
    "KeyF",
    "KeyG",
    "KeyH",
    "KeyJ",
    "KeyK",
    "KeyL",
    "Semicolon",
    "Quote",
    "Backslash",

    // Zの行
    "KeyZ",
    "KeyX",
    "KeyC",
    "KeyV",
    "KeyB",
    "KeyN",
    "KeyM",
    "Comma",
    "Period",
    "Slash",
    "IntlRo",

    // 最下段
    "Space",
  ]);

  document.querySelectorAll(".keyboard .key").forEach((key) => {
    key.disabled = !enabledCodes.has(key.dataset.code);
  });
}

// 指定したキーを点灯する
// 複数のキーも指定できる
function activateKeys(...codes) {
  clearActiveKeys();

  codes.forEach((code) => {
    keysByCode.get(code)?.classList.add("is-active");
  });
}

// 使用対象のキーから、ランダムに1つ点灯する
function activateRandomKey() {
  const candidates = keys.filter(
    (key) => !key.disabled,
  );

  if (candidates.length === 0) {
    clearActiveKeys();
    return null;
  }

  const index = Math.floor(Math.random() * candidates.length);
  const code = candidates[index].dataset.code;

  activateKeys(code);

  return code;
}

function activateRandomKeys(count = 3) {
  // 使用しないキーと無効なキーを除外する
  const candidates = [...keysByCode.keys()].filter((code) => {
    const key = keysByCode.get(code);

    return !key.disabled;
  });

  // 候補をシャッフルする
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  // 指定数のキーを選んで点灯する
  const codes = candidates.slice(0, Math.max(0, Math.trunc(count)));

  activateKeys(...codes);

  return codes;
}

// 現在押されているキー
const pressedKeys = new Set();

// 今回の入力に含まれたキー（重複なし）
const inputKeys = new Set();

// 入力が完了した時刻の保存先（performance.now() の値）
const collectedTimes = [];

window.addEventListener("keydown", (event) => {
  // Setなので、長押しによるkeydownの繰り返しも重複しない
  pressedKeys.add(event.code);
  inputKeys.add(event.code);
});

window.addEventListener("keyup", (event) => {
  // 押下を検出していないキーの解放は無視
  if (!pressedKeys.delete(event.code)) {
    return;
  }

  // すべてのキーが離れたら、1回分の時刻を記録
  if (pressedKeys.size === 0) {
    const releasedAt = event.timeStamp;
    const keys = [...inputKeys];

    collectedTimes.push(releasedAt);

    inputKeys.clear();
    onInputCompleted(releasedAt, keys);
  }
});

function onInputCompleted(releasedAt, keys) {
  console.log("解放時刻:", releasedAt);
  console.log("入力キーリスト:", keys);

  // 別途取得した開始時刻を startedAt とすると：
  // const elapsedMs = releasedAt - startedAt;
}

// フォーカスを失うとkeyupを取得できない場合があるため、
// 途中の入力を破棄して状態をリセットする
window.addEventListener("blur", () => {
  pressedKeys.clear();
  inputKeys.clear();
});

// popover 사용하기
const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
const popoverList = [...popoverTriggerList].map(
  (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
);

let answer = "abcde";
let input = document.querySelector(".input");
let keyboard = document.querySelector(".key-container");
let checking = false;
let currentTile = 0;
let existWord = [];

const keys = [
  "q",
  "w",
  "e",
  "r",
  "t",
  "y",
  "u",
  "i",
  "o",
  "p",
  "a",
  "s",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "enter",
  "z",
  "x",
  "c",
  "v",
  "b",
  "n",
  "m",
  ,
  "del",
];
let currentWord = [];

// Word API fetch
async function getWords() {
  try {
    const response = await fetch("https://random-word-api.herokuapp.com/word?length=5");
    const data = await response.json();

    // json배열을 문자열로 변환
    answer = data.join("");
    console.log(answer);
  } catch (error) {
    console.log(error);
  }
}

// Check if the word exists
async function saveExistWord() {
  try {
    const response = await fetch(`https://random-word-api.herokuapp.com/all`);
    const data = await response.json();
    existWord = data;
  } catch (error) {
    console.log(error);
  }
}

// square container 그리기
for (let i = 0; i < 30; i++) {
  let square = document.createElement("input");
  square.setAttribute("type", "text");
  square.setAttribute("maxlength", "1");
  square.setAttribute("class", "square");
  square.setAttribute("id", i);
  if (i === 0) {
    square.setAttribute("autofocus", "true");
  }
  input.appendChild(square);
}

let squares = document.querySelectorAll(".square");

// keyboard
keys.forEach((key) => {
  const buttonElement = document.createElement("button");
  buttonElement.classList.add("key");
  if (key === "enter") {
    buttonElement.classList.add("enter");
  }
  if (key === "del") {
    buttonElement.classList.add("del");
  }
  buttonElement.setAttribute("id", key);
  buttonElement.addEventListener("click", () => handleClick(key));
  buttonElement.textContent = key;
  keyboard.appendChild(buttonElement);
});

// keyboard click event
function handleClick(key) {
  const tile = document.getElementById(currentTile);

  if (key === "enter") {
    spellCheck(squares);
  } else if (key === "del") {
    if (tile.value !== "") {
      currentWord.pop();
      tile.value = "";
      tile.classList.remove("active");
      if (currentTile < 0) {
        currentTile = 0;
      }
    } else if (tile.value === "" && currentWord.length > 0) {
      tile.previousElementSibling.classList.remove("active");
      tile.previousElementSibling.value = "";
      currentTile--;
      currentWord.pop();
    }
  } else if (currentWord.length === 0 || currentWord.length % 5 !== 0) {
    currentWord.push(key);
    tile.value = key;
    tile.classList.add("active");
    currentTile++;
  }
  console.log(key, currentTile, currentWord);
}

// input generator
function inputGenerator(inputs) {
  // onlyLetters(inputs);

  // input 입력할때
  inputs.forEach((input, index) => {

    // 모바일 자판 막기 
    input.addEventListener("touchstart", (e) => {
      e.preventDefault();
    });

    input.addEventListener("input", (e) => {
      console.log(currentWord);
      // 영문만 입력되도록 하기
      input.value = input.value.replace(/[^a-zA-Z]/g, "");
      // input 안에 값이 있으면 class active 추가하고 focus를 다음 input으로 이동
      if (input.value !== "") {
        currentWord.push(input.value);
        input.classList.add("active");
        if (currentWord.length % 5 !== 0) {
          input.nextElementSibling.focus();
        }
      }
    });

    // 뒤로가기 버튼 누를시
    input.addEventListener("keydown", (e) => {
      // checking 중일때는 뒤로가기 불가
      if (checking) {
        console.log("key blocked");
        e.preventDefault();
      } else {
        if (e.key === "Backspace") {
          if (input.value === "" && currentWord.length % 5 !== 0) {
            currentWord.pop();
            input.previousElementSibling.focus();
            input.previousElementSibling.classList.remove("active");
          } else if (input.value !== "" && currentWord.length % 5 === 0) {
            currentWord.pop();
            input.value = "";
            input.classList.remove("active");
          }
        }

        // 엔터 누르면 단어 검사
        if (e.key === "Enter") {
          spellCheck(inputs);
        }
      }
    });
  });
}

// spelling check function, setTimeout을 사용해서 각각 애니메이션 나오게끔 만듬 index * 200
function spellCheck(inputs) {
  // 영단어가 아니면 오류메세지를 띄운다
  console.log(currentWord);
  const word = currentWord.join("");

  let correctAnswer = "";

  if (currentWord.length % 5 !== 0) {
    alert("5글자를 채워주세요");
  } else if (!existWord.includes(word)) {
    alert("영단어가 아닙니다");
  } else {
    checking = true;
    // 영단어가 맞으면 검사
    inputs.forEach((input, i) => {
      if (input.value !== "") {
        setTimeout(() => {
          if (input.value === answer[i % 5]) {
            input.style.background = "#6aaa64";
            input.classList.add("flip");
          } else if (answer.includes(input.value)) {
            input.style.background = "#c9b458";
            input.classList.add("flip");
          } else {
            input.style.background = "#787c7e";
            input.classList.add("flip");
          }
        }, 100 * Math.ceil((i + 1) % 5 === 0 ? 5 : (i + 1) % 5));

        // 정답을 맞출 경우 / 못맞출경우
        if (word === answer) {
          correctAnswer = `정답입니다! ${answer}`;
        } else if (word !== answer && i === 29) {
          correctAnswer = `오답입니다! 정답은 ${answer} 입니다.`;
        } else {
          currentWord = [];
          // 1초 뒤 input focus 넘어감
          setTimeout(() => {
            checking = false;
            input.nextElementSibling.focus();
          }, 1000);
        }
      }
    });

    if (correctAnswer) {
      setTimeout(() => {
        alert(correctAnswer);
        window.location.reload();
      }, 1000);
    }
  }
}

// only letters can be entered in the input
// function onlyLetters(inputs) {
//   inputs.forEach((input) => {
//     input.addEventListener("keydown", (e) => {
//       if (!/[a-z]/.test(e.key)) {
//         e.preventDefault();
//       } else {
//         return false;
//       }
//     });
//   });
// }

// 윈도우 실행시
window.onload = function () {
  getWords();
  saveExistWord();
  inputGenerator(squares);
};

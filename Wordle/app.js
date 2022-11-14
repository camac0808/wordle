// popover 사용하기
const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
const popoverList = [...popoverTriggerList].map(
  (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
);

let answer = "abcde";
let input = document.querySelector(".input");
let keyboard = document.querySelector(".key-container");

const keys = [
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "Del",
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
  "M",
  "Enter",
];
let currentWord = [];

// input container 그리기
for (let i = 0; i < 30; i++) {
  let square = document.createElement("input");
  square.setAttribute("type", "text");
  square.setAttribute("maxlength", "1");
  square.setAttribute("class", "square");
  if (i === 0) {
    square.setAttribute("autofocus", "true");
  }
  input.appendChild(square);
}

// keyboard
keys.forEach((key) => {
  const buttonElement = document.createElement("button");
  buttonElement.classList.add("key");
  buttonElement.setAttribute('id', key);
  buttonElement.addEventListener("click", handleClick);
  buttonElement.textContent = key;
  
  keyboard.appendChild(buttonElement);
});

function handleClick(e) {
  console.log(e.target.textContent);
}

window.onload = function () {
  let squares = document.querySelectorAll(".square");
  inputGenerator(squares);
};

// input generator
function inputGenerator(inputs) {
  let allKeys = document.querySelectorAll(".key");

  onlyLetters(inputs);

  // input 입력할때
  inputs.forEach((input, index) => {
    input.addEventListener("input", (e) => {
      console.log("input");
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
        e.preventDefault();
        spellCheck(inputs);
      }
    });
  });

  // TODO:keyboard event 설정
  // allKeys.forEach((key) => {
  //   key.addEventListener("click", (e) => {
  //     console.log(e.target.textContent);
  //     document.activeElement = e.target.textContent;
  //     document.activeElement.nextElementSibling.focus();
  //   });
  //   if (key.classList.contains === "enter") {
  //     key.addEventListener("click", (e) => {
  //       spellCheck(inputs);
  //     });
  //   }
  // });
}

// spelling check function, setTimeout을 사용해서 각각 애니메이션 나오게끔 만듬 index * 200
function spellCheck(inputs) {
  // 영단어가 아니면 오류메세지를 띄운다
  let word = [];
  inputs.forEach((input) => {
    word.push(input.value);
  });
  console.log(currentWord);
  //TODO: word api를 사용해서 영단어가 맞는지 확인
  // if (word.join("") !== wordAPI) {
  //   alert("영단어를 입력해주세요");
  //   return;
  // }

  if (currentWord.length % 5 !== 0) {
    alert("5글자를 채워주세요");
    // } else if (currentWord.join("") !== wordAPI) {
    //   alert("영단어를 입력해주세요");
  } else {
    // 영단어가 맞으면 검사
    inputs.forEach((input, i) => {
      if (input.value !== "") {
        setTimeout(() => {
          if (input.value === answer[i]) {
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
        if (currentWord.join("") === answer) {
          setTimeout(() => {
            alert("정답입니다!");
            location.reload();
          }, 1000);
        } else if (currentWord.join("") !== answer && i === 29) {
          setTimeout(() => {
            alert(`오답입니다!, 정답은 ${answer} 입니다`);
            location.reload();
          }, 1000);
        } else {
          currentWord = [];
          // 1초 뒤 input focus 넘어감
          setTimeout(() => {
            input.nextElementSibling.focus();
          }, 1000);
        }
      }
    });
  }
}

// only letters can be entered in the input
function onlyLetters(inputs) {
  inputs.forEach((input) => {
    input.addEventListener("keydown", (e) => {
      if (!/[a-z]/.test(e.key)) {
        e.preventDefault();
      } else {
        return false;
      }
    });
  });
}

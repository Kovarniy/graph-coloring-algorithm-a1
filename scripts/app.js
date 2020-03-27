//Дирректива use struct говорит о том, что код в этом файле работает в строгом режиме
//Данная директива должна быть первой строчкой файла. Над ней могут содержаться только комментарии
"use strict";
let matrixBoard,
  oldSize = 2;

window.onload = function() {
  matrixBoard = document.getElementById("matrixBoard");
};

function renderMatrix(matrixSize) {
  for (let i = 1; i <= oldSize * oldSize; i++) {
    let inp = document.querySelector(`#inp${i}`);
    inp.remove();
    if (i <= oldSize) {
      let br = document.querySelector(`#br${i}`);
      br.remove();
    }
  }

  let inputId = 1;
  let brId = 1;
  for (let i = 0; i < matrixSize; i++) {
    for (let j = 0; j < matrixSize; j++) {
      let input = document.createElement("input");
      input.id = `inp${inputId}`;
      inputId++;
      matrixBoard.append(input);
    }
    let br = document.createElement("br");
    br.id = `br${brId}`;
    brId++;
    matrixBoard.append(br);
  }

  oldSize = matrixSize;
}

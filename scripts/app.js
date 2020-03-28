//Дирректива use struct говорит о том, что код в этом файле работает в строгом режиме
//Данная директива должна быть первой строчкой файла. Над ней могут содержаться только комментарии
"use strict";
let matrixBoard;
let currentSize = 2;
let arrColors = ["red", "blue", "green", "orange", "aqua", "violet"];
let adjMatrix = []; // Матрица смежности

//TODO: возможно стоит создать объект
/*
В котором будет храниться:
1. Матрица смежности
2. Массив вершин
3. Метод для расскраски
4. цвета
*/

class Vertex {
  constructor(number, deg) {
    this.number = number;
    this.deg = deg;
    this.color = null;
  }
}

window.onload = function() {
  matrixBoard = document.getElementById("matrixBoard");
  //Данная функция нужна для корректной работы автокомплита у стандартной матрицы 2x2
  let startInput = document.querySelectorAll("#matrixBoard > input");
  startInput[1].onchange = autoComlitMatrix;
  startInput[2].onchange = autoComlitMatrix;
};

function renderMatrix(matrixSize) {
  let inp = document.querySelectorAll("#matrixBoard > input");
  for (let i = 0; i < currentSize * currentSize; i++) {
    inp[i].remove();
  }
  let br = document.querySelectorAll("#matrixBoard > br");
  for (let i = 0; i < currentSize; i++) {
    br[i].remove();
  }

  for (let i = 0; i < matrixSize; i++) {
    for (let j = 0; j < matrixSize; j++) {
      let input = document.createElement("input");

      input.setAttribute("x", `${i + 1}`);
      input.setAttribute("y", `${j + 1}`);
      input.setAttribute("size", "5");
      input.classList.add("iputField");

      if (i == j) {
        input.setAttribute("disabled", "disabled");
        input.setAttribute("value", "0");
      } else {
        input.setAttribute("required", "required");
        input.setAttribute("pattern", "[0-1]{1,1}");
        //input.addEventListener("change", autoComlitMatrix);
        input.onchange = autoComlitMatrix;
      }

      sendMatrix.before(input);
    }
    let br = document.createElement("br");
    sendMatrix.before(br);
  }

  currentSize = matrixSize;
}

//Заносит аналогичное значение в симетричную клетку
function autoComlitMatrix() {
  let x = this.getAttribute("x");
  let y = this.getAttribute("y");
  let cellValue = this.value;
  let elem = document.querySelector(`input[x="${y}"][y="${x}"]`);
  elem.value = cellValue;
}

function parsingMatrix() {
  for (let i = 0; i < currentSize; i++) {
    adjMatrix[i] = [];
    for (let j = 0; j < currentSize; j++) {
      let elem = document.querySelector(`input[x="${i + 1}"][y="${j + 1}"]`);
      adjMatrix[i][j] = elem.value;
    }
  }
  createVertex();
  return false;
}

function createVertex() {
  let arrVertex = [];
  for (let i = 0; i < currentSize; i++) {
    let deg = 0;
    for (let j = 0; j < currentSize; j++) {
      deg += parseInt(adjMatrix[i][j]);
    }
    arrVertex[i] = new Vertex(i, deg);
  }
  coloring(arrVertex);
}

function coloring(arr) {
  //sortByDeg(arr);
  let coutColingVertex = 0;

  for (let i = 0; i < currentSize; i++) {
    let num = arr[i].number;
    //Если элемент еще не окрашивали, то окрасим его
    if (arr[i].color == null) {
      //console.log("стандартная окраска");
      arr[i].color = arrColors[i];
      coutColingVertex++;
      //console.log(arr[i]);
    }

    //Проверяем матрицу смежности
    for (let j = 0; j < currentSize; j++) {
      //Если нашли не диагональный и не смежный элемент, то можно его окрасить
      if (num != j && adjMatrix[num][j] == 0) {
        //console.log("такой эл есть");
        if (arr[j].color == null) {
          //console.log("и он не окрашен");
          arr[j].color = arrColors[i];
          coutColingVertex++;
        }
      }
      //Проверка на то, окрашены ли все вершины
      if (coutColingVertex == currentSize) {
        for (let i = 0; i < currentSize; i++) {
          console.log(arr[i]);
        }
        return;
      }
    }
  }
}

function sortByDeg(arr) {
  arr.sort(function(a, b) {
    return b.deg - a.deg;
  });
}

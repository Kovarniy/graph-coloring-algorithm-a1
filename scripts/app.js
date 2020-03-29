//Дирректива use struct говорит о том, что код в этом файле работает в строгом режиме
//Данная директива должна быть первой строчкой файла. Над ней могут содержаться только комментарии
"use strict";
let matrixBoard, canvas, contex;
let currentSize = 2;
let arrColors = [
  "OrangeRed",
  "Orange",
  "Gold",
  "LawnGreen",
  "Aqua",
  "DodgerBlue",
  "Magenta"
];
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
    this.x = null;
    this.y = null;
  }
}

window.onload = function() {
  matrixBoard = document.getElementById("matrixBoard");
  //Данная функция нужна для корректной работы автокомплита у стандартной матрицы 2x2
  let startInput = document.querySelectorAll("#matrixBoard > input");
  startInput[1].onchange = autoComlitMatrix;
  startInput[2].onchange = autoComlitMatrix;
  canvas = document.getElementById("sheet");
  contex = canvas.getContext("2d");
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
  //console.log(arrVertex);
  drawGraph(arrVertex);
}

function coloring(arrVertex) {
  sortByDeg(arrVertex);
  let coutColingVertex = 0;

  for (let i = 0; i < currentSize; i++) {
    let num = arrVertex[i].number;

    //Если элемент еще не окрашивали, то окрасим его
    if (arrVertex[i].color == null) {
      //console.log("стандартная окраска");

      arrVertex[i].color = arrColors[i];
      coutColingVertex++;
    }

    //Проверяем матрицу смежности
    for (let j = 0; j < currentSize; j++) {
      //Если нашли не диагональный и не смежный элемент, то можно его окрасить
      if (num != j && adjMatrix[num][j] == 0) {
        //console.log("такой эл есть" + j);
        let index = findByNumber(arrVertex, j);
        //console.log(index);
        if (arrVertex[index].color == null) {
          //console.log("и он не окрашен");
          arrVertex[index].color = arrColors[i];
          coutColingVertex++;
        }
      }
      //Проверка на то, окрашены ли все вершины
      if (coutColingVertex == currentSize) {
        for (let i = 0; i < currentSize; i++) {
          console.log(arrVertex[i]);
        }
        return;
      }
    }
  }
}

//  TODO: этот метод можно переделать таким образом, чтобы он
// мог находить любой объект, по любому полю и значению
function findByNumber(arrVertex, index) {
  for (let i = 0; i < currentSize; i++) {
    if (arrVertex[i].number == index) {
      return i;
    }
  }
  return -1;
}

function sortByDeg(arrVertex) {
  arrVertex.sort(function(a, b) {
    return b.deg - a.deg;
  });
}

function sortByNum(arrVertex) {
  arrVertex.sort(function(a, b) {
    return a.number < b.number ? -1 : 1;
  });
}

function drawGraph(arrVertex) {
  contex.clearRect(0, 0, 600, 600);
  sortByNum(arrVertex);
  calculateXY(arrVertex);
  drawRib(arrVertex);
  drawVertex(arrVertex);
}

function calculateXY(arrVertex) {
  let distance = 360 / currentSize;
  let index = 0;
  for (let i = 0; i < 360; i += distance) {
    arrVertex[index].x = Math.cos(getRad(i));
    arrVertex[index].y = Math.sin(getRad(i));
    index++;
  }
}

function drawRib(arrVertex) {
  //Если у вершин разные цвета, то рисуем между ними путь
  for (let i = 0; i < currentSize; i++) {
    for (let j = 1; j < currentSize; j++) {
      if (adjMatrix[i][j] == 1) {
        contex.beginPath();
        contex.moveTo(300 + arrVertex[i].x * 100, 300 + arrVertex[i].y * 100);
        contex.lineTo(300 + arrVertex[j].x * 100, 300 + arrVertex[j].y * 100);
        contex.stroke();
      }
    }
  }
}

function drawVertex(arrVertex) {
  for (let i = 0; i < currentSize; i++) {
    contex.beginPath();
    contex.fillStyle = arrVertex[i].color;
    contex.arc(
      300 + arrVertex[i].x * 100,
      300 + arrVertex[i].y * 100,
      20,
      0,
      360
    );
    contex.stroke();
    contex.fill();
  }
}

function getRad(deg) {
  //3.14 / 180 - 1град в радианах
  return (deg * Math.PI) / 180;
}

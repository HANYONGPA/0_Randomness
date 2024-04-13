let grid;
let debugMode = false;
let cols = 40;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(width / 100);
  grid = new Grid(cols);
}

function draw() {
  background(255);
  grid.display();
}

function keyPressed() {
  if (keyCode === ENTER) {
    grid.walker.index = floor(random(0, grid.walker.nextId.length));
    grid.walker.update();
    grid.walker.currentId = grid.walker.nextId[grid.walker.index];
    grid.walker.ease.update(grid.walker.targetPos);
    console.log(
      grid.walker.index,
      grid.walker.nextId[grid.walker.index],
      grid.walker.currentId
    );
  }

  if (key === "d") {
    debugMode = !debugMode;
  }
}

class Walker {
  constructor(x, y, size, id) {
    this.pos = createVector(x, y);
    this.targetPos = createVector(x, y);
    this.size = size;

    this.ease = new EaseVec2(this.pos, this.targetPos);

    this.index = 0;
    this.currentId = id;
    this.next = [
      -cols - 1,
      -cols,
      -cols + 1,
      -1,
      0,
      1,
      cols - 1,
      cols,
      cols + 1,
    ];
    this.nextId = new Array(9).fill(0);
  }

  update() {
    for (let i = 0; i < this.next.length; i++) {
      this.nextId[i] = this.currentId + this.next[i];
    }
    this.targetPos = grid.cells[this.nextId[this.index]].center;
    this.ease.easeVec2(1);
  }

  display() {
    push();
    fill(0);
    ellipse(this.pos.x, this.pos.y, this.size);
    rect(this.pos.x - this.size / 2, this.pos.y - this.size / 2, this.size);
    if (debugMode) {
      stroke(255);
      strokeWeight(2);
      ellipse(this.targetPos.x, this.targetPos.y, this.size / 2);
    }
    pop();
  }
}

class Grid {
  constructor(cols, cellSize = width / cols, rows = height / cellSize) {
    this.cols = cols;
    this.rows = rows;
    this.cellSize = cellSize;
    this.cells = [];
    this.generateCells();

    let id = this.cells.length / 2;
    this.walker = new Walker(
      this.cells[id].center.x,
      this.cells[id].center.y,
      this.cellSize,
      id
    );
  }

  generateCells() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.cells.push(
          new Cell(
            j * this.cellSize,
            i * this.cellSize,
            this.cellSize,
            j + i * this.cols
          )
        );
      }
    }
  }

  display() {
    if (debugMode) {
      for (let i = 0; i < this.cells.length; i++) {
        this.cells[i].display();
      }
    }
    this.walker.update();
    this.walker.display();
  }
}

class Cell {
  constructor(x, y, size, id) {
    this.pos = createVector(x, y);
    this.center = createVector(x + size / 2, y + size / 2);
    this.size = size;

    this.id = id;
  }

  display() {
    rect(this.pos.x, this.pos.y, this.size, this.size);
    text(this.id, this.center.x, this.center.y);
  }
}

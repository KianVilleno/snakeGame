const SNAKE_SIZE = 20;
const STEPS = SNAKE_SIZE;
let SNAKE = [];
let MOUSE;
let GAME_STATE = false;
let SCORE = 0;

//Up = -1, DOWN = 1;
let X_DIRECTION = 0;
//Left = -1, Right = 1;
let Y_DIRECTION = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  MOUSE = new FOOD();
  MAKE_FOOD();
  //Making the snake;
  MAKE_SNAKE();
}

function update() {
  if (GAME_STATE) {
    SNAKE_UPDATE();
    EAT_FOOD_UPDATE();
    HIT_TAIL_UPDATE();
  }
}

function draw() {
  background("#f0ece3");
  frameRate(8);
  if (GAME_STATE) START_GAME();
  RENDER_SNAKE();
  SHOW_SCORE();
  MAIN_MENU_TEXT();
}

function START_GAME() {
  update();
  MOUSE.render();
}

class SNAKE_BODY {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.size = SNAKE_SIZE;
    this.color = "#c7b198";
    this.x = this.position.x;
    this.y = this.position.y;
  }
  render() {
    fill(this.color);
    noStroke();
    rect(this.position.x, this.position.y, this.size, this.size);
  }
}

class FOOD {
  constructor() {
    this.position = createVector();
    this.size = SNAKE_SIZE;
    this.color = "#596e79";
  }
  render() {
    fill(this.color);
    noStroke();
    rect(this.position.x, this.position.y, this.size, this.size);
  }
}

function MAKE_SNAKE() {
  let INITIAL_X = floor(floor(width / 2) / SNAKE_SIZE) * SNAKE_SIZE;
  let INITIAL_Y = floor(floor(height / 2) / SNAKE_SIZE) * SNAKE_SIZE;

  let NEW_SNAKE = new SNAKE_BODY(INITIAL_X, INITIAL_Y);
  SNAKE.push(NEW_SNAKE);
}

function EAT_FOOD_UPDATE() {
  let SNAKE_HEAD = SNAKE[0];
  if (
    SNAKE_HEAD.position.x == MOUSE.position.x &&
    SNAKE_HEAD.position.y == MOUSE.position.y
  ) {
    MAKE_FOOD();
    NEW_BODY();
    SCORE++;
  }
}

function RENDER_SNAKE() {
  SNAKE[0].color = "#c7b198";
  for (let body of SNAKE) {
    body.render();
    if (GAME_STATE) {
      body.color = "#dfd3c3";
    }
  }
  //making the head diff color;
}

function SNAKE_UPDATE() {
  let SNAKE_HEAD = SNAKE[0];
  let NEW_X = SNAKE_HEAD.position.x + X_DIRECTION * STEPS;
  let NEW_Y = SNAKE_HEAD.position.y + Y_DIRECTION * STEPS;

  if (SNAKE_HEAD.position.x > width - SNAKE_SIZE && X_DIRECTION == 1) NEW_X = 0;
  if (SNAKE_HEAD.position.x < 0 + SNAKE_SIZE && X_DIRECTION == -1)
    NEW_X = floor(width / SNAKE_SIZE) * SNAKE_SIZE;

  if (SNAKE_HEAD.position.y > height - SNAKE_SIZE && Y_DIRECTION == 1)
    NEW_Y = 0;
  if (SNAKE_HEAD.position.y < 0 + SNAKE_SIZE && Y_DIRECTION == -1)
    NEW_Y = floor(height / SNAKE_SIZE) * SNAKE_SIZE;

  let LAST_BODY = SNAKE.pop();
  LAST_BODY.position.x = NEW_X;
  LAST_BODY.position.y = NEW_Y;
  SNAKE.unshift(LAST_BODY);
}

function INVERT_NUMBER(VALUE) {
  return (VALUE *= -1);
}

function keyPressed() {
  switch (key) {
    case "W":
      SNAKE_MOVETO("UP");
      break;
    case "S":
      SNAKE_MOVETO("DOWN");
      break;
    case "A":
      SNAKE_MOVETO("LEFT");
      break;
    case "D":
      SNAKE_MOVETO("RIGHT");
      break;
  }
}

function SNAKE_MOVETO(DIRECTION) {
  if (!GAME_STATE) {
    GAME_STATE = true;
    SNAKE = [];
    MOUSE = new FOOD();
    MAKE_FOOD();
    //Making the snake;
    MAKE_SNAKE();
    SCORE = 0;
  }
  X_DIRECTION = 0;
  Y_DIRECTION = 0;
  switch (DIRECTION) {
    case "UP":
      Y_DIRECTION = -1;
      break;
    case "DOWN":
      Y_DIRECTION = 1;
      break;
    case "LEFT":
      X_DIRECTION = -1;
      break;
    case "RIGHT":
      X_DIRECTION = 1;
      break;
  }
}

function NEW_BODY() {
  let NEW_BODY_X = -100;
  let NEW_BODY_Y = -100;
  let NEW_SNAKE = new SNAKE_BODY(NEW_BODY_X, NEW_BODY_Y);
  SNAKE.push(NEW_SNAKE);
}

function MAKE_FOOD() {
  let RANDOM_X = abs(
    floor(random(1, (width - SNAKE_SIZE) / SNAKE_SIZE)) * SNAKE_SIZE
  );
  let RANDOM_Y = abs(
    floor(random(1, (height - SNAKE_SIZE) / SNAKE_SIZE)) * SNAKE_SIZE
  );
  MOUSE.position.x = RANDOM_X;
  MOUSE.position.y = RANDOM_Y;
}

function HIT_TAIL_UPDATE() {
  let SNAKE_HEAD = SNAKE[0];
  for (let TAIL of SNAKE) {
    if (TAIL != SNAKE_HEAD) {
      if (
        SNAKE_HEAD.position.x == TAIL.position.x &&
        SNAKE_HEAD.position.y == TAIL.position.y
      ) {
        GAME_OVER();
      }
    }
  }
}

function GAME_OVER() {
  NEW_BODY();
  GAME_STATE = false;
  for (let body of SNAKE) {
    body.color = "#b83b5e";
  }
}

function SHOW_SCORE() {
  let COLOR_TEXT = color("#204051");
  let SNAKE_HEAD = SNAKE[0];
  let TEXT_RADIUS_POSITION = createVector(width / 2 - 10, 50);
  let TEXT_DIAMETER = 400;
  let TEXT_RADIUS = TEXT_DIAMETER / 2;
  let TEXT_DIST_SNAKE = dist(
    SNAKE_HEAD.position.x,
    SNAKE_HEAD.position.y,
    TEXT_RADIUS_POSITION.x,
    TEXT_RADIUS_POSITION.y
  );
  let TEXT_DIST_MOUSE = dist(
    MOUSE.position.x,
    MOUSE.position.y,
    TEXT_RADIUS_POSITION.x,
    TEXT_RADIUS_POSITION.y
  );

  if (TEXT_DIST_SNAKE < TEXT_DIST_MOUSE) {
    if (TEXT_DIST_SNAKE < TEXT_RADIUS)
      COLOR_TEXT.setAlpha(floor(TEXT_DIST_SNAKE));
  } else {
    if (TEXT_DIST_MOUSE < TEXT_RADIUS)
      COLOR_TEXT.setAlpha(floor(TEXT_DIST_MOUSE));
  }

  textSize(100);
  noStroke();
  textAlign(CENTER, TOP);
  fill(COLOR_TEXT);

  SCORE_TEXT = text(SCORE, 12, 12, width, height);
}

function MAIN_MENU_TEXT() {
  if (!GAME_STATE) {
    textSize(12);
    noStroke();
    textAlign(CENTER, BOTTOM);
    fill("black");
    textFont("Helvetica");
    SCORE_TEXT = text("SWIPE TO PLAY OR WASD", 0, 0, width, SNAKE[0].y + 100);
  }
}

//swipe for mobile

let xDown = null;
let yDown = null;

document.addEventListener("touchstart", handleTouchStart, false);
document.addEventListener("touchmove", handleTouchMove, false);

function handleTouchStart(evt) {
  xDown = evt.touches[0].clientX;
  yDown = evt.touches[0].clientY;
  if (!GAME_STATE) {
    GAME_STATE = true;
    SNAKE = [];
    MOUSE = new FOOD();
    MAKE_FOOD();
    //Making the snake;
    MAKE_SNAKE();
    SCORE = 0;
  }
}

function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return;
  }
  var xUp = evt.touches[0].clientX;
  var yUp = evt.touches[0].clientY;
  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    /*most significant*/
    if (xDiff > 0) {
      /* left swipe */
      SNAKE_MOVETO("LEFT");
    } else {
      /* right swipe */
      SNAKE_MOVETO("RIGHT");
    }
  } else {
    if (yDiff > 0) {
      /* up swipe */
      SNAKE_MOVETO("UP");
    } else {
      /* down swipe */
      SNAKE_MOVETO("DOWN");
    }
  }
  /* reset values */
  xDown = null;
  yDown = null;
}

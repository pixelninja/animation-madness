/*
	Library
*/
var x = 25;
var y = 250;
var dx = 1.5;
var dy = -4;
var context;

var WIDTH;
var HEIGHT;
var paddleX;
var paddleH = 10;
var paddleW = 75;
var rightDown = false;
var leftDown = false;
var canvasMinX = 0;
var canvasMaxX = 0;
var intervalID = 0;
var bricks;
var NROWS = 5;
var NCOLS = 10;
var BRICKWIDTH;
var BRICKHEIGHT = 15;
var PADDING = 1;

function init() {
  context = $('#canvas')[0].getContext("2d");
  WIDTH = $("#canvas").width();
  HEIGHT = $("#canvas").height();
  paddleX = WIDTH / 2;
  BRICKWIDTH = (WIDTH/NCOLS) - 1;
  canvasMinX = $("#canvas").offset().left;
  canvasMaxX = canvasMinX + WIDTH;
  intervalID = setInterval(draw, 10);
  return intervalID;
}

function circle(x,y,r) {
  context.beginPath();
  context.arc(x, y, r, 0, Math.PI*2, true);
  context.closePath();
  context.fill();
}

function rect(x,y,w,h) {
  context.beginPath();
  context.rect(x,y,w,h);
  context.closePath();
  context.fill();
}

function clear() {
  context.clearRect(0, 0, WIDTH, HEIGHT);
  rect(0,0,WIDTH,HEIGHT);
}

function onKeyDown(evt) {
  if (evt.keyCode == 39) rightDown = true;
  else if (evt.keyCode == 37) leftDown = true;
}

function onKeyUp(evt) {
  if (evt.keyCode == 39) rightDown = false;
  else if (evt.keyCode == 37) leftDown = false;
}

$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);

function onMouseMove(evt) {
  if (evt.pageX > canvasMinX && evt.pageX < canvasMaxX) {
    paddleX = Math.max(evt.pageX - canvasMinX - (paddleW/2), 0);
    paddleX = Math.min(WIDTH - paddleW, paddleX);
  }
}

$(document).mousemove(onMouseMove);

function initBricks() {
    bricks = new Array(NROWS);
    for (i=0; i < NROWS; i++) {
        bricks[i] = new Array(NCOLS);
        for (j=0; j < NCOLS; j++) {
            bricks[i][j] = 1;
        }
    }
}

function drawBricks() {
  for (i=0; i < NROWS; i++) {
    context.fillStyle = rowColors[i];
    for (j=0; j < NCOLS; j++) {
      if (bricks[i][j] == 1) {
        rect((j * (BRICKWIDTH + PADDING)) + PADDING, 
             (i * (BRICKHEIGHT + PADDING)) + PADDING,
             BRICKWIDTH, BRICKHEIGHT);
      }
    }
  }
}
/* end */


var ballR = 10;
var rowColors = ["#FF1C0A", "#FFFD0A", "#00A308", "#0008DB", "#EB0093"];
var paddleColor = "#FFFFFF";
var ballColor = "#FFFFFF";
var backColor = "#000000";

function draw() {
  context.fillStyle = backColor;
  clear();
  context.fillStyle = ballColor;
  circle(x, y, ballR);

  if (rightDown) paddleX += 5;
  else if (leftDown) paddleX -= 5;
  context.fillStyle = paddleColor;
  rect(paddleX, HEIGHT-paddleH, paddleW, paddleH);

  drawBricks();

  //want to learn about real collision detection? go read
  // http://www.harveycartel.org/metanet/tutorials/tutorialA.html
  rowheight = BRICKHEIGHT + PADDING;
  colwidth = BRICKWIDTH + PADDING;
  row = Math.floor(y/rowheight);
  col = Math.floor(x/colwidth);
  //reverse the ball and mark the brick as broken
  if (y < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] == 1) {
    dy = -dy;
    bricks[row][col] = 0;
  }
 
  if (x + dx + ballR > WIDTH || x + dx - ballR < 0)
    dx = -dx;

  if (y + dy - ballR < 0)
    dy = -dy;
  else if (y + dy + ballR > HEIGHT - paddleH) {
    if (x > paddleX && x < paddleX + paddleW) {
      //move the ball differently based on where it hit the paddle
      dx = 8 * ((x-(paddleX+paddleW/2))/paddleW);
      dy = -dy;
    }
    else if (y + dy + ballR > HEIGHT)
      clearInterval(intervalID);
  }
 
  x += dx;
  y += dy;
}

init();
initBricks();
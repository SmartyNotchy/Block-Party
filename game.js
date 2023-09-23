///////////////////////
// GENERAL VARIABLES //
///////////////////////

var colors = ["Red", "Orange", "Yellow", "Lime", "Cyan", "Blue", "Purple", "Magenta", "Brown"];

///////////////////////
// GENERAL FUNCTIONS //
///////////////////////

function remove(array, value) {
      return array.filter(function(ele){ 
          return ele != value; 
      });
  }

///////////////////
// COLOR SQUARES //
///////////////////

class Square {
  constructor(x, y, color) {
    this.x = x;
    this.y = y; 
    this.color = color;
  }
}


///////////////
// GAMEBOARD //
///////////////

var gameboard = [];
var colorCount = {};
var requirements = colors;

for (let color in colors) {
  colorCount[colors[color]] = 0;
}

for (let row = 0; row < 50; row++) {
  gameboard[row] = [];
  for (let column = 0; column < 50; column++) {
    if (requirements.length !== 0) {
      let color = requirements[Math.floor(Math.random() * requirements.length)];
      gameboard[row][column] = new Square(row, column, color);
      colorCount[color]++;
      if (colorCount[color] === 200) {
        requirements = remove(requirements, color);
      }
    } else {
      gameboard[row][column] = new Square(row, column, colors[Math.floor(Math.random() * colors.length)]);
    }
  }
}

function checkIfSafe(x, y) {
  var topY = Math.min(Math.max(Math.floor(y-0.75), 1), 49);
  var bottomY = Math.min(Math.max(Math.floor(y-0.25), 1), 49);
  var leftX = Math.min(Math.max(Math.floor(x-0.75), 1), 49);
  var rightX = Math.min(Math.max(Math.floor(x-0.25), 1), 49);
  if (gameboard[topY][leftX].color === selectedColor) return true;
  if (gameboard[topY][rightX].color === selectedColor) return true;
  if (gameboard[bottomY][leftX].color === selectedColor) return true;
  if (gameboard[bottomY][rightX].color === selectedColor) return true;
  return false;
}

////////////
// PLAYER //
////////////

class Player {
  constructor() {
    this.x = 25;
    this.y = 25;
  }
  
  move(arrowKeys) {
    let up = arrowKeys["ArrowUp"] || arrowKeys["w"];
    let down = arrowKeys["ArrowDown"] || arrowKeys["s"];
    let left = arrowKeys["ArrowLeft"] || arrowKeys["a"];
    let right = arrowKeys["ArrowRight"] || arrowKeys["d"];
    
    if (up && this.y > 1) this.y -= 0.1;
    if (down && this.y < 50) this.y += 0.1;
    if (left && this.x > 1) this.x -= 0.1;
    if (right && this.x < 50) this.x += 0.1;
  }
}

//////////////
// GRAPHICS //
//////////////

var ctx = document.getElementById("canvas").getContext("2d");
document.body.style.background = "darkgray";

/*function testDraw() { //For testing purposes only; draws the entire gameboard where each square takes up 10*10 pixels.
  for (let row = 0; row < 50; row++) {
    for (let column = 0; column < 50; column++) {
      ctx.fillStyle = gameboard[row][column].color;
      ctx.fillRect(column*10, row*10, (column+1)*10, (row+1)*10);
    }
  }
}
testDraw();
*/	

function drawGameboard(x, y) {
  drawing = true;
  var startRow = Math.floor(y - 3); 
  var endRow = Math.floor(y + 3);
  var startColumn = Math.floor(x - 3);
  var endColumn = Math.floor(x + 3);
  var xOffset = (x-Math.floor(x))*100;
  var yOffset = (y-Math.floor(y))*100;
  for (let row = startRow; row < endRow; row++) {
    for (let column = startColumn; column < endColumn; column++) {
      if (row >= 0 && column >= 0 && row < 50 && column < 50) {
        if (status === "roundEnd" && gameboard[row][column].color !== selectedColor) ctx.fillStyle = "white";
        else ctx.fillStyle = gameboard[row][column].color;
      } else ctx.fillStyle = "white";
      
      ctx.fillRect((column-startColumn)*100+500-xOffset, (row-startRow)*100+100-yOffset, 100, 100);
    }
  }
  ctx.fillStyle = "black";
  ctx.fillRect(725, 325, 50, 50);
  ctx.fillStyle = "white";
  ctx.fillRect(730, 330, 40, 40);
  ctx.fillStyle = "lightgray";
  ctx.fillRect(0, 0, 500, 700);
  ctx.fillRect(0, 0, 1500, 100);
  ctx.fillRect(0, 600, 1500, 100);
  ctx.fillRect(1000, 0, 500, 700);
  
  ctx.fillStyle = "black";
  ctx.font = "30px Courier";
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  ctx.fillText("Round: " + round, 500, 70);
  ctx.textAlign = "right";
  if (selectedColor !== null) {
    ctx.fillStyle = selectedColor;
    ctx.fillText("Color: " + selectedColor, 1000, 70);
  } else ctx.fillText("Color: ???", 1000, 70);
  
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillStyle = "cyan";
  ctx.fillText("Time", 500, 630);
  ctx.fillStyle = "darkcyan";
  ctx.fillRect(600, 640, 380, 10);
  ctx.fillStyle = "cyan";
  if (time === null && status !== "roundEnd") ctx.fillRect(600, 640, 380, 10);
  else if (status === "colorSelect") ctx.fillRect(600, 640, Math.floor((time/(Math.max((5-round*0.1)*1000, 1000)))*380), 10);
  
  if (gameover) {
    ctx.fillStyle = "Black";
    ctx.font = "80px Courier";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GAME OVER", 750, 250);
  }
  drawing = false;
}

function drawMenu() {
  ctx.fillStyle = "white";
  ctx.fillRect(500, 100, 500, 500);
  let color = Math.floor(Math.random() * colors.length);
  ctx.fillStyle = colors[color];
  ctx.font = "70px Courier";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("BLOCK PARTY", 750, 200);
  ctx.font = "30px Courier";
  ctx.fillText("Click to play", 750, 500);
}

function drawInstructions() {
  ctx.fillStyle = "white";
  ctx.fillRect(500, 100, 500, 500);
  ctx.fillStyle = "black";
  ctx.font = "20px Courier";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Use the arrow keys to move your player.", 750, 200);
  ctx.fillText("Every round, a tune will be played and", 750, 250);
  ctx.fillText("color will be selected.", 750, 275);
  ctx.fillText("You need to move your player to the", 750, 325);
  ctx.fillText("respective color before time runs", 750, 350);
  ctx.fillText("out, or its GAME OVER!", 750, 375);
  ctx.fillText("Click to start game", 750, 500);
}


//////////////
// GAMELOOP //
//////////////

var player = new Player();

var round = 0;
var status = "menu";
var audioPlaying = false;
var selectedColor = null;
var time = null;
var drawing = false;
var gameover = false;



// Track Keypresses
function trackKeys(keys) {
  let down = Object.create(null);
  function track(event) {
    if (keys.includes(event.key)) {
      down[event.key] = event.type == "keydown";
      event.preventDefault();
    }
  }
  window.addEventListener("keydown", track);
  window.addEventListener("keyup", track);
  return down;
}

const arrowKeys = trackKeys([
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "w",
  "a",
  "s",
  "d",
]);

setInterval(function() {
  if (status !== "roundEnd" && !gameover) {
    player.move(arrowKeys);
  }
}, 30);




var music = [
  [new Audio("yankeeDoodle.mp3"), 9000],
  [new Audio("oldMcDonald.mp3"), 9000],
  [new Audio("twinkle.mp3"), 13000],
  [new Audio("marylamb.mp3"), 8000]
];

window.addEventListener("click", event => {
  if (status === "menu") {
    status = "instructions";
  } else if (status === "instructions") {
    status = "inProgress";
    var drawloop = setInterval(function() {
      if (!drawing) drawGameboard(player.x, player.y);
    }, 20);
    clearInterval(menudrawloop);
  }
});

var gameloop = setInterval(function() {
  if (status === "inProgress") {
    if (!audioPlaying) {
      round++;
      audioPlaying = true;
      var track = Math.floor(Math.random() * music.length);
      let speedMod = 1;
      if (round > 5) {
        speedMod = 1.25;
      }
      if (round > 10) {
        speedMod = 1.5;
      }
      if (round > 15) {
        speedMod = 1.75;
      }
      if (round > 20) {
        speedMod = 2;
      }

      music[track][0].playbackRate = speedMod;
      music[track][0].play();
      setTimeout(function() {
        audioPlaying = false;
        status = "colorSelect";
      }, music[track][1] / speedMod);
    }
  } else if (status === "colorSelect") {
    if (selectedColor === null) {
      selectedColor = colors[Math.floor(Math.random() * colors.length)];
    }
    if (time === null) {
      time = Math.max((5 - round * 0.1)*1000, 1000);
      (new Audio("countdown.mp3")).play();
      var countdown = setInterval(function() {
        (new Audio("countdown.mp3")).play();
      }, (time/5));
      setTimeout(function() {
        status = "roundEnd";
        clearInterval(countdown);
      }, time);
      // Set interval to play click sounds
    } else {
      time -= 10;
    }
  } else if (status === "roundEnd") {
    if (!checkIfSafe(player.x, player.y)) {
      gameover = true;
      clearInterval(gameloop);
      clearInterval(drawloop);
    }
    drawGameboard(player.x, player.y);
    if (time !== null) {
      setTimeout(function() {
        status = "inProgress";
        selectedColor = null;
        time = null;
      }, 3000);
    }
    time = null;
  }
  
}, 10);

var menudrawloop = setInterval(function() {
  if (status === "menu") {
    drawMenu();
  } else {
    drawInstructions();
  }
}, 500);







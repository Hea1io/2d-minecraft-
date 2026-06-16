const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const TILE_SIZE = 32;
const GRAVITY = 0.5;
const MOVE_SPEED = 4;
const JUMP_SPEED = -12; 

const world = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]

];

const player = {
    x: 100,
    y: 50,
    width: 25, 
    height: 40,
    vx: 0,
    vy: 0,
    onGround: false 
};

const keys = {};

document.addEventListener("keydown", function(event) {
    keys[event.key] = true;
});

document.addEventListener("keyup", function(event) {
    keys[event.key] = false;
});

function drawBlock(x, y, type) {
    if (type === 0) return;

    if (type === 1) {
        ctx.fillStyle = "green";
    }

    if (type === 2) {
        ctx.fillStyle = "brown";
    }

    ctx.fillRect(
        x * TILE_SIZE,
        y * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE
    );
}

function drawWorld() {
    
    for (let row = 0; row <world.length; row++) {
        for (let col = 0; col < world[row].length; col++) {

            drawBlock(col, row, world[row][col]);
        }
    }
}


function drawPlayer() {
    ctx.fillStyle = "blue";

    ctx.fillRect(
        player.x,
        player.y,
        player.width,
        player.height
    );
}

function updatePlayer() {
    
    player.vx = 0;

    if (keys["a"] || keys["ArrowLeft"]) {
        player.vx = -MOVE_SPEED;
    }

    if (keys["d"] || keys["ArrowRight"]) {
        player.vx = MOVE_SPEED;
    }

    if (
        (keys["w"] || keys["ArrowUp"] || keys[" "]) && 
        player.onGround
    ){
        player.vy = JUMP_SPEED;
        player.onGround = false;
    }

    

player.x += player.vx;

player.vy += GRAVITY;
player.y += player.vy;

const groundY = 4 * TILE_SIZE;

if (player.y + player.height > groundY) {
    player.y = groundY - player.height;
    player.vy = 0;
    player.onGround = true;
 } 
}

function draw() {
    
    ctx.clearRect(0,0, canvas.width, canvas.height);

    drawWorld();

    drawPlayer();
}

function gameLoop() {
    updatePlayer();
    draw();
    requestAnimationFrame(gameLoop);

}

gameLoop();











const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const TILE_SIZE = 32;
const GRAVITY = 0.5;
const MOVE_SPEED = 4;
const JUMP_SPEED = -12; 

let cameraX = 0;


const world = [];

for (let row = 0; row <20; row++) {

    world[row] = [];

    for (let col = 0; col<50; col++) {
        if (row < 10) {
            world[row][col] = 0;
        }
        else if (row === 10) {
            world[row][col] = 1;
        }
        else {
            world[row][col] = 2;
        }
    }
}

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
        x * TILE_SIZE - cameraX,
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
        player.x - cameraX,
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

const groundY = 10 * TILE_SIZE;

if (player.y + player.height > groundY) {
    player.y = groundY - player.height;
    player.vy = 0;
    player.onGround = true;
 } 

 cameraX = player.x - canvas.width / 2;

 if (cameraX < 0) {
    cameraX = 0;
 }
}



function draw() {
    
    ctx.clearRect(0,0, canvas.width, canvas.height);

    drawWorld();

    drawPlayer();
}

canvas.addEventListener("click", function(event) {
    const rect = canvas.getBoundingClientRect();

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const worldX = Math.floor((mouseX + cameraX) / TILE_SIZE);
    const worldY = Math.floor(mouseY / TILE_SIZE);

    if (
        worldY >= 0 &&
        worldY < world.length &&
        worldX >= 0 &&
        worldX < world[0].length
    ) {
        world[worldY][worldX] = 0;
    }
    
});

function gameLoop() {
    updatePlayer();
    draw();
    requestAnimationFrame(gameLoop);

}

gameLoop();











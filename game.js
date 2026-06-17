const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const TILE_SIZE = 32;
const GRAVITY = 0.5;
const MOVE_SPEED = 4;
const JUMP_SPEED = -12; 

let cameraX = 0;

let mouseDown = false;

let miningBlockX = -1; 
let miningBlockY = -1; 

let miningProgress = 0;
const MINING_TIME = 30;

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

function getBlock(x, y) {

    if (
        x < 0 ||
        x >= world[0].length ||
        y < 0 ||
        y >= world.length 
    ) {
        return 0;
    }

    return world[y][x];
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

const playerBottom = player.y + player.height;

const blockX = Math.floor(
    (player.x + player.width / 2) / TILE_SIZE
);

const blockY = Math.floor(
    (playerBottom + 1) / TILE_SIZE
);

if (getBlock(blockX, blockY) !== 0) {

    player.y = blockY * TILE_SIZE - player.height;

    player.vy = 0;
    player.onGround = true;
} else {

    player.onGround = false;
}

if (player.y > canvas.height + 500) {
    player.y = 0;
    player.vy = 0;
}



 cameraX = player.x - canvas.width / 2;

 if (cameraX < 0) {
    cameraX = 0;
 }
}



function draw() {
    
    ctx.clearRect(0,0, canvas.width, canvas.height);

    drawWorld();

    drawMiningEffect();

    drawPlayer();
}

canvas.addEventListener("mousedown", function(event) {

    mouseDown = true;

    const rect = canvas.getBoundingClientRect();

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    miningBlockX = Math.floor((mouseX + cameraX) / TILE_SIZE);
    miningBlockY = Math.floor(mouseY / TILE_SIZE);

    miningProgress = 0;

});

document.addEventListener("mouseup", function() {
    
    mouseDown = false;

    miningBlockX = -1;
    miningBlockY = -1;
    miningProgress = 0;

});

function updateMining() {

    if (!mouseDown) {
        return;
    }
    if (miningBlockX === -1) {
        return;
    }

    miningProgress++; 

    if (miningProgress >= MINING_TIME) {

        world[miningBlockY][miningBlockX] = 0;

        miningBlockX = -1;
        miningBlockY = -1;
        miningProgress = 0;
    }
}


function drawMiningEffect() {

    if (miningBlockX == -1) {
        return;
    }

    const progress = miningProgress / MINING_TIME;

    const x = miningBlockX * TILE_SIZE - cameraX;
    const y = miningBlockY * TILE_SIZE;

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    if (progress > 0.2) { 
        ctx.beginPath();
        ctx.moveTo(x + 5, y + 5 );
        ctx.lineTo(x + 27, y + 27);
        ctx.stroke();
    }


    if (progress > 0.4) { 
        ctx.beginPath();
        ctx.moveTo(x + 27, y + 5 );
        ctx.lineTo(x + 5, y + 27);
        ctx.stroke();
    }



    if (progress > 0.6) { 
        ctx.beginPath();
        ctx.moveTo(x +16, y);
        ctx.lineTo(x + 16, y + 32);
        ctx.stroke();
    }



    if (progress > 0.8) { 
        ctx.beginPath();
        ctx.moveTo(x, y + 16 );
        ctx.lineTo(x + 32, y + 16);
        ctx.stroke();
    }
}


   

function gameLoop() {
    updatePlayer();
    updateMining();
    draw();
    requestAnimationFrame(gameLoop);

}

gameLoop();











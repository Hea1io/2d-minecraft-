const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const TILE_SIZE = 32;
const GRAVITY = 0.5;
const MOVE_SPEED = 4;
const JUMP_SPEED = -12; 

let cameraX = 0;
let gameState = "menu";
let mouseDown = false;
let miningBlockX = -1; 
let miningBlockY = -1; 
let miningProgress = 0;
let inventoryOpen = false;
let selectedBlock = 1;
const BLOCK_TYPES = {
    1: {name: "Grass", color: "green"},
    2: {name: "Dirt", color: "brown"},
    3: {name: "Wood", color: "#8B4513"},
    4: {name: "Leaves", color: "#77DD77"}
};

const inventory = {
    dirt: 0,
    grass: 0,
    wood: 0,
    leaves: 0
};

const MINING_TIME = 30;
const droppedItems = [];
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

for (let tree = 0; tree < 8; tree++) { 
      const x = Math.floor(Math.random() * 46) + 2;

    world[9][x] = 3;
    world[8][x] = 3;
    world[7][x] = 3;

    world[6][x] = 4;

    world[7][x - 1] = 4;
    world[7][x + 1] = 4;

    world[6][x - 1] = 4;
    world[6][x + 1] = 4;

    world[5][x] = 4;

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

document.addEventListener("keydown", function(event) {
    if ( 
        gameState === "menu" && 
        event.key === "Enter"

    ){
        gameState = "playing";
    }
    keys[event.key] = true;

    if (event.key.toLowerCase() === "e") {

        inventoryOpen = !inventoryOpen;
    }

});


function drawMenu() {

    ctx.fillStyle = "skyblue";
    ctx.fillRect(0,0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        "Minecraft 2D",
        canvas.width / 2,
        150
    );

    ctx.font = "24px Arial";

    ctx.fillText(
        "Press ENTER to Start",
        canvas.width / 2,
        250

    );
}

function drawBlock(x, y, type) {
    if (type === 0) return;

    if (type === 1) {
        ctx.fillStyle = "green";
    }

    if (type === 2) {
        ctx.fillStyle = "brown";
    }

    if (type === 3) {
        ctx.fillStyle = "#8B4513";
    }

    if (type === 4) {
        ctx.fillStyle = "#77DD77"

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

function drawInventory() {
    if (!inventoryOpen) {
        return;
    }

    ctx.fillStyle= 'rgba(0,0,0,0.8)';
    ctx.fillRect(100, 50, 400, 300);

    ctx.fillStyle = "white";
    ctx.font = "24px Arial"; 
    ctx.fillText("Inventory", 120, 90);

    const blockTypes = [
        { id: 1, name: "Grass", key: 'grass'},
        { id: 2, name: "Dirt", key: 'dirt'},
        {id: 3, name: "Wood", key: 'wood'},
        {id: 4, name: "Leaves", key: 'leaves'},

    ];

let yPos = 120;
for (let i = 0; i < blockTypes.length; i++) {
    const block = blockTypes[i];
    const xPos = 120 + (i * 80);

    ctx.fillStyle = BLOCK_TYPES[block.id].color;
    ctx.fillRect(xPos, yPos, 30, 30);
    ctx.strokeStyle = "white";
    ctx.linewidth = 1;
    ctx.strokeRect(xPos, yPos, 30, 30);

   ctx.fillStyle = "white";
   ctx.font = "16px Arial";
   ctx.fillText(inventory[block.key], xPos + 35, yPos + 20);

   ctx.font = "12px Arial";
   ctx.fillText(block.name, xPos, yPos + 45);

   if (selectedBlock === block.id) {
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 3;
    ctx.strokeRect (xPos -2, yPos -2, 34, 34);

   }

 }

 ctx.fillStyle = "white";
 ctx.font = "16px Arial";
 ctx.fillText("Click a block to select it", 120, 300);
 ctx.fillText("Right-click to place blocks", 120, 330);
}


function updateItems() { 

    for (let i = droppedItems.length - 1; i >= 0; i--) {

        const item = droppedItems[i];

        const dx = player.x + player.width / 2 - item.x;
        const dy = player.y + player.height / 2 - item.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 30){

            if (item.type === 1) inventory.grass++;
            if (item.type === 2) inventory.dirt++;
            if (item.type === 3) inventory.wood++;
            if (item.type === 4) inventory.leaves++;

            droppedItems.splice(i, 1);
        }

    }
}
function draw() {
    
    ctx.clearRect(0,0, canvas.width, canvas.height);

    drawWorld();

    drawMiningEffect();

    drawPlayer();

    drawDroppedItems();

    drawInventory();
}

canvas.addEventListener("mousedown", function(event) {
 
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

   const blockX = Math.floor((mouseX + cameraX) / TILE_SIZE);
   const blockY = Math.floor(mouseY / TILE_SIZE);

   if (event.button ===2) {
    event.preventDefault();

    if (inventoryOpen) return;

    const blockKey = ['', 'grass', 'dirt', 'wood', 'leaves'][selectedBlock];
    if (inventory[blockKey] <= 0) return;

    if (blockX < 0 || blockX >= world[0]. length || blockY < 0 || blockY >= world.length) return;

        if (world[blockY][blockX] !== 0) return;

        const playerBlockX = Math.floor((player.x + player.width / 2) / TILE_SIZE);

        const playerBlockY = Math.floor((player.y + player.height) / TILE_SIZE);

        if (blockX === playerBlockX &&
            (blockY === playerBlockY || blockY === playerBlockY -1)) {
                return;
            }
            
            world[blockY][blockX] = selectedBlock;
            inventory[blockKey]--;
   }
            if (event.button === 0) {
                if (inventoryOpen) return;

                mouseDown = true;
                miningBlockX = blockX;
                miningBlockY = blockY;
                miningProgress = 0;
            }
});

canvas.addEventListener("click", function(event) {
    if (!inventoryOpen) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const blockTypes = [1,2,3,4];
    let yPos = 120;

    for (let i = 0; i < blockTypes.length; i++) {  
        const xPos = 120 + (i * 80);

        if (mouseX >= xPos && mouseX <= xPos + 30 &&
            mouseY >= yPos && mouseY <= yPos + 30) {
                const blockId = blockTypes[i];
                const blockKey = ['grass', 'dirt', 'wood', 'leaves'][i];

                if (inventory[blockKey] > 0) {
                    selectedBlock = blockId;
                }
                break;
            }
      
     }
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

       const blockType = world[miningBlockY][miningBlockX];

       droppedItems.push({
        x: miningBlockX * TILE_SIZE + TILE_SIZE / 2,
        y: miningBlockY * TILE_SIZE + TILE_SIZE / 2,
        type: blockType
       });

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

function drawDroppedItems() {
    for (let item of droppedItems) {
        if (item.type === 1) {
            ctx.fillStyle = "green";
        }
        if (item.type === 2){
            ctx.fillStyle = "brown";
        
        }

        if (item.type === 3){
            ctx.fillStyle = "#8B4513"
        }

        if (item.type === 4){
            ctx.fillStyle = "#77DD77"
        }

        ctx.fillRect(
            item.x - cameraX - 8,
            item.y - 8,
            16,
            16
        );
    }
}

   

function gameLoop() {

    if (gameState === "menu") {

        drawMenu();   
    } else if (gameState === "playing") {

        updatePlayer();
        updateMining();
        updateItems();
        draw();
    }
    requestAnimationFrame(gameLoop);

}

gameLoop();











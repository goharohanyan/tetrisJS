let canvas;
let context;
let gameBoardHeight = 20;
let gameBoardWidth = 12;
let startX = 4;
let startY = 0;

let coordinates = [...Array(gameBoardHeight)].map(e => Array(gameBoardWidth).fill(0));
let currentFigure = [];
let figures = [];
let figureColor = ["#193026", "#534A3C", "#413D3D", "#989482", "#928062", "#81C0D8", "#B38548"];
let colors;

let gameBoard = [...Array(gameBoardHeight)].map(e => Array(gameBoardWidth).fill(0));
let stoppedFigures = [...Array(gameBoardHeight)].map(e => Array(gameBoardWidth).fill(0));

let DIRECTION = {
    IDLE : 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3,
};
let direction;

let score = 0;
let level = 1;
let winOrLose = "Playing";
let isPaused = false;

class Coordinates{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

document.addEventListener('DOMContentLoaded', createCanvas);

function createArrayOfCoordinates(){
    let i = 0;
    let j = 0;
    for (let y = 9; y <= 333; y += 17) {
        for (let x = 9; x <= 207; x += 17) {
            coordinates[i][j] = new Coordinates(x,y);
            i++;
        }
        j++;
        i = 0;
    }
}

function createCanvas(){
    canvas = document.getElementById('my-canvas');
    context = canvas.getContext('2d');
    canvas.width = 712;
    canvas.height = 720;
    canvas.style.position = "fixed";
    context.scale(2, 2);
    
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = 'rgb(21, 32, 24)';
    context.strokeRect(7.5, 7.5, 207, 344);

    
    context.fillStyle = 'rgb(21, 32, 24)';
    context.font = "18px Arial";

    context.fillText("Score", 230, 40);
    context.strokeRect(230,50,120,18);
    context.fillText(score.toString(),240, 66);

    context.fillText("Level", 230, 90);
    context.strokeRect(230,100,120,18);
    context.fillText(level.toString(), 240, 116);

    context.fillText("Win / Lose",230, 140);
    context.strokeRect(230, 150, 120, 30);
    context.fillText(winOrLose, 240, 172);

    context.fillText("CONTROLS", 230, 200);
    context.strokeRect(230, 210, 120, 110);
    context.font = "16px Arial"
    context.fillText("←: Press left", 235, 230);
    context.fillText("→: Press right", 235, 250);
    context.fillText("↓: Press down", 235, 270);
    context.fillText("↷: Press up", 235, 290);
    context.fillText("▶: Press space", 235, 310);
    
    document.addEventListener("keydown", keysHandle);

    createFigures();
    createFigure();

    createArrayOfCoordinates();
    draw();
}

function draw(){
    for(let i = 0; i < currentFigure.length; i++){
        let x = currentFigure[i][0] + startX;
        let y = currentFigure[i][1] + startY;
        gameBoard[x][y] = 1;
        let coorX = coordinates[x][y].x; 
        let coorY = coordinates[x][y].y;
        context.fillStyle = colors;
        context.fillRect(coorX, coorY, 15.5, 15.5);
    }
}

function keysHandle(key){
    if(winOrLose !== "Game over"){
        if(key.keyCode === 37 && !isPaused){
            direction = DIRECTION.LEFT;
            if(!checkForWallHitting() && !checkForHorizontalCollison()){
                deleteFigure();
                startX--;
                draw();
            }
        } else if(key.keyCode === 39 && !isPaused) {
            direction = DIRECTION.RIGHT;
            if(!checkForWallHitting() && !checkForHorizontalCollison()){
                deleteFigure();
                startX++;
                draw();
            }
        } else if(key.keyCode === 40 && !isPaused) {
            moveDown();
        } else if(key.keyCode === 38 && !isPaused){
            rotate();
        } else if(key.keyCode === 32){
            isPaused = !isPaused;
        }
    }
    
}

function moveDown(){
    direction = DIRECTION.DOWN;
    if(!checkForVerticalCollison()){
        deleteFigure();
        startY++;
        draw();
    }
}

window.setInterval(function(){
    if(winOrLose !== "Game over"){
        if(!isPaused){
            moveDown();
        }
    }
}, 1000)

function deleteFigure(){
    for(let i = 0; i < currentFigure.length; i++){
        let x = currentFigure[i][0] + startX;
        let y = currentFigure[i][1] + startY;
        gameBoard[x][y] = 0;
        let coorX = coordinates[x][y].x;
        let coorY = coordinates[x][y].y;
        context.fillStyle = 'white';
        context.fillRect(coorX, coorY, 15.5, 15.5);
    }
}

function createFigures(){
    figures.push([[0, 0], [1, 0], [2, 0], [3, 0]]); //I
    figures.push([[1, 0], [0, 1], [1, 1], [2, 1]]); //T
    figures.push([[0, 0], [1, 0], [1, 1], [2, 1]]); //Z
    figures.push([[1, 0], [2, 0], [0, 1], [1, 1]]); //S
    figures.push([[0, 0], [0, 1], [1, 1], [2, 1]]); //J
    figures.push([[2, 0], [0, 1], [1, 1], [2, 1]]); //L
    figures.push([[0, 0], [1, 0], [0, 1], [1, 1]]); //Square
}

function createFigure(){
    let randomTetromino = Math.floor(Math.random() * figures.length);
    currentFigure = figures[randomTetromino];
    colors = figureColor[randomTetromino];
}

function checkForWallHitting(){
    for(let i = 0; i < currentFigure.length; i++){
        let newX = currentFigure[i][0] + startX;
        if(newX <= 0 && direction === DIRECTION.LEFT){
            return true;
        } else if(newX >= 11 && direction === DIRECTION.RIGHT){
            return true;
        }
    }
    return false;
}

function checkForVerticalCollison(){
    let tetrominoCopy = currentFigure;
    let collision = false;
    for(let i = 0; i < tetrominoCopy.length; i++){
        let square = tetrominoCopy[i];
        let x = square[0] + startX;
        let y = square[1] + startY;
        if(direction === DIRECTION.DOWN){
            y++;
        }
        if(typeof stoppedFigures[x][y + 1] === "string"){
            deleteFigure();
            startY++;
            draw();
            collision = true;
            break;
        }  
        if(y >= 20){
            collision = true;
            break;
        }
    }
    if(collision){
        if(startY <= 2){
            winOrLose = "Game Over";
            isPaused = true;
            context.fillStyle = 'white';
            context.fillRect(230, 150, 120, 30);
            context.fillStyle = 'rgb(21, 32, 24)';
            context.fillText(winOrLose, 240, 172);
        } else {
            for(let i = 0; i < tetrominoCopy.length; i++){
                let square = tetrominoCopy[i];
                let x = square[0] + startX;
                let y = square[1] + startY;
                stoppedFigures[x][y] = colors;
            }
            checkForCompletedRows();
            createFigure();
            direction = DIRECTION.IDLE;
            startX = 4;
            startY = 0;
            draw();
        }
    }
    return collision;
}
 
function checkForHorizontalCollison(){
    let tetrominoCopy = currentFigure;
    let collision = false;
    for(let i = 0; i < tetrominoCopy.length; i++){
        let square = tetrominoCopy[i];
        let x = square[0] + startX;
        let y = square[1] + startY;
        if(direction === DIRECTION.LEFT){
            x--;
        } else if(direction === DIRECTION.RIGHT){
            x++;
        }
        var stoppedShapeVal = stoppedFigures[x][y];
        if(typeof stoppedShapeVal === "string"){
            collision = true;
            break;
        }
    }
    return collision;   
}

function checkForCompletedRows(){
    let rowToDelete = 0;
    let startDeletion = 0;
    for(let y = 0; y < gameBoardHeight; y++){
        let completed = true;
        for(let x = 0; x < gameBoardWidth; x++){
            let square = stoppedFigures[x][y];
            if(square === 0 || (typeof square === "undefined")){
                completed = false;
                break;
            }
        }
        if(completed){
            if(startDeletion === 0){
                startDeletion = y;
            }
            rowToDelete++;
            for(let i = 0; i < gameBoardWidth; i++){
                stoppedFigures[i][y] = 0;
                gameBoard[i][y] = 0;
                let coorX = coordinates[i][y].x;
                let coorY = coordinates[i][y].y;
                context.fillStyle = "white";
                context.fillRect(coorX, coorY, 15.5, 15.5);
            }
        }
        if(rowToDelete > 0){
            debugger;
            if(rowToDelete < 3){ //bonus 8 points per row
                score += rowToDelete * 12;
            } else {
                score += rowToDelete * (8 + 12);
            }
            context.fillStyle = 'white';
            context.fillRect(230, 50, 120, 18);
            context.fillStyle = 'rgb(21, 32, 24)';
            context.fillText(score.toString(),240, 66);
            if(score % 60 === 0){
                level++;
                context.fillStyle = 'white';
                context.fillRect(230, 100, 120, 18);
                context.fillStyle = "rgb(21, 32, 24)";
                context.fillText(level.toString(), 240, 116);
            }        
            moveDownAllRows(rowToDelete, startDeletion);
            startDeletion = 0;
            rowToDelete = 0;
        }
    }
    
}

function moveDownAllRows(rowsToDelete, startDeletion){
    for(var i = startDeletion - 1; i >= 0; i--){
        for(var x = 0; x < gameBoardWidth; x++){
            var y2 = i + rowsToDelete;
            var square = stoppedFigures[x][i];
            var nextSquare = stoppedFigures[x][y2];
            if(typeof square === "string"){
                nextSquare = square;
                gameBoard[x][y2] = 1;
                stoppedFigures[x][y2] = square;
                let coorX = coordinates[x][y2].x;
                let coorY = coordinates[x][y2].y;
                context.fillStyle = nextSquare;
                context.fillRect(coorX, coorY, 15.5, 15.5);
                
                square = 0;
                gameBoard[x][i] = 0;
                stoppedFigures[x][i] = 0;
                coorX = coordinates[x][i].x;
                coorY = coordinates[x][i].y;
                context.fillStyle = "white";
                context.fillRect(coorX, coorY, 15.5, 15.5);
            }
        }
    }
}

function rotate() {
    let newRotation = new Array();
    let tetrominoCopy = currentFigure;
    let curTetrominoBU;
    for (let i = 0; i < tetrominoCopy.length; i++) {
        curTetrominoBU = [...currentFigure];
        let x = tetrominoCopy[i][0];
        let y = tetrominoCopy[i][1];
        let newX = (getLastX(currentFigure) - y);
        let newY = x;
        newRotation.push([newX,newY]);
    }
    deleteFigure();
    let newLastX = getLastX(newRotation);
    let newFirstX = getFirstX(newRotation);
    if (startX < gameBoardWidth / 2) {
        if(startX + newFirstX < 0) {
            startX -= newFirstX;
        }
    }
    if (startX > gameBoardWidth / 2) {
        if (startX + newLastX > 11) {
            startX = 11 - newLastX;
        }
    }
    
    try {
        currentFigure = newRotation;
        if(startX < 0 ) {
            startX = 0;
        }
        draw();
    }
    catch(e) {
        if (e instanceof TypeError) {
            currentFigure = curTetrominoBU;
            deleteFigure();
            draw();
        }
    }
}

function getLastX(curTetromino) {
    let lastX = 0;
    for (let i = 0; i < curTetromino.length; i++) {
        let square = curTetromino[i];
        if(square[0] > lastX) {
           lastX = square[0];    
        }
        
    }
    return lastX;
}

function getFirstX(curTetromino) {
    let firstX = 3;
    for (let i = 0; i < curTetromino.length; i++) {
        let square = curTetromino[i];
        if(square[0] < firstX) {
           firstX = square[0];    
        }
        
    }
    return firstX;
}

const canvas=document.getElementById("game");
const context=canvas.getContext("2d");

//image of the board
const board = new Image();
board.src = "img/gameBoard.png";

//image of the food
const apple = new Image();
apple.src = "img/apple.png";

//height | width of 1 square
let box = 32;

//variable to keep score
let score = 0;

//object to show food at random place
let food = {
    xCoordinate: Math.floor(Math.random() * 17 + 1) * box,
    yCoordinate: Math.floor(Math.random() * 15 + 3) * box + 6,  
};

//object to show snake
let snake = [];
snake[0] = {
    xCoordinate: 9 * box,
    yCoordinate: 9 * box + 6,
};

//Restart Game
function restart(){
    score = 0;
    snake = [];
    snake[0] = {
        xCoordinate: 9 * box,
        yCoordinate: 9 * box + 6,
    };
    dir = "";
    clearInterval(interval);
    interval = setInterval(drawGame, 150);

}

// Key control
document.addEventListener("keydown", direction);
let dir; 
function direction(event){
    if(event.keyCode == 37 && dir != "right"){    //37 is the code for the arrow to the left
        dir = "left";
    }
    else if(event.keyCode == 38 && dir != "down"){    //37 is the code for the arrow up
        dir = "up";
    }
    else if(event.keyCode == 39 && dir != "left"){    //37 is the code for the arrow to the right
        dir = "right";
    }
    else if(event.keyCode == 40 && dir != "up"){    //37 is the code for the arrow down
        dir = "down";
    }
    if(event.keyCode == 32){    //if space pressed -> restart the game
        restart();
    }
}

//function that receives the snake and its head
//if head touches tail -> stop the game
function eatTail(head, snake){
    if(snake.length>4){
        for(let i=0; i<snake.length;i++){
            if(head.xCoordinate == snake[i].xCoordinate && head.yCoordinate == snake[i].yCoordinate){
                clearInterval(interval);
                dir = "";
                drawRepeat();
            }
        }
    }
}

function drawRepeat(){
    //image of the lose message
    const repeat = new Image();
    repeat.src = "img/repeat1.png";
    context.drawImage(repeat, 0, 0);
    //display score
    context.fillStyle = "white";
    context.font = "50px Arial";
    context.fillText("Your score is: " + score, box * 4, box*6.5);

    //display text(spaceBar->restart)
    context.fillStyle = "white";
    context.font = "15px Arial";
    context.fillText("* Press SpaceBar to restart the game :)", box*1.5, box *18.7);
}

//returns 1 if the received coordinates do not appear among the snake's coordinates
function notEqualCoordinates(x, y){
    let isEqual=1;
    for(let i=0; i<snake.length;i++){
        if(x==snake[i].xCoordinate && y==snake[i].yCoordinate){
            isEqual=0;
        }
    }
    return isEqual;
}

//function that draws game's context
function drawGame(){
    context.drawImage(board, 0, 0);
    context.drawImage(apple, food.xCoordinate, food.yCoordinate);

    for(let i=0; i<snake.length; i++){
        context.fillStyle = i == 0 ? "green" : "yellow";
        context.fillRect(snake[i].xCoordinate, snake[i].yCoordinate, box, box);
    }

    //display score
    context.fillStyle = "white";
    context.font = "50px Arial";
    context.fillText(score, box*2, box *1.4);

    //display text(spaceBar->restart)
    context.fillStyle = "white";
    context.font = "15px Arial";
    context.fillText("* Press SpaceBar to restart the game :)", box*1.5, box *18.7);

    //display snake
    let snakeX = snake[0].xCoordinate;
    let snakeY = snake[0].yCoordinate;

    //if snake eats food -> food reappears in the different place and score increases
    if(snakeX == food.xCoordinate && snakeY == food.yCoordinate){
        score++;
        do{
            food = {
                xCoordinate: Math.floor(Math.random() * 17 + 1) * box,
                yCoordinate: Math.floor(Math.random() * 15 + 3) * box + 6,
            };
        }while(notEqualCoordinates(food.xCoordinate, food.yCoordinate)!=1);
    }
    else {
        snake.pop();
    }

    //if snake touches borders -> game stops
    if((snakeX < box-15 || snakeX > box * 17) 
    || (snakeY < 2 * box || snakeY > box * 19)){
        clearInterval(interval);
        dir = "";
        drawRepeat();
    }

    //change coordinates of the snake's body
    if(dir == "left") {
        snakeX = snakeX - box;
    }
    if(dir == "right") {
        snakeX = snakeX + box;
    }
    if(dir == "up") {
        snakeY = snakeY - box;
    }
    if(dir == "down") {
        snakeY = snakeY + box;
    }

    //Create one more head at new position 
    let newHead = {
        xCoordinate: snakeX,
        yCoordinate: snakeY
    };

    //check whether the tail was touched
    eatTail(newHead,snake);

    if(snake.length>285){
        clearInterval(interval);
        dir = "";
        //image of the winmessage
        const win = new Image();
        win.src = "img/win.png";
        context.drawImage(win, 0, 0);
        
        //display text(spaceBar->restart)
        context.fillStyle = "white";
        context.font = "15px Arial";
        context.fillText("* Press SpaceBar to restart the game :)", box*1.5, box *18.7);
        
    }
    snake.unshift(newHead);
}

let interval = setInterval(drawGame,150);

// function main(){
//     drawGame();  
// }
let canvas;
const boardWidth = window.innerWidth;
const boardHeight = window.innerHeight;
let context;

const attackerHeight =  80;
const attackerWidth = 60;
const attackerX = boardWidth/8;
const attackerY = boardHeight/2;
let attackerImage;

const attacker = {
    x : attackerX,
    y : attackerY,
    width : attackerWidth,
    height : attackerHeight
}


let defenderArray = [];
const defenderWidth = 100;
const defenderHeight = 620;
const defenderX = boardWidth;
const defenderY = 0;
let topDefenderImg;
let bottomDefenderImg;


let score = 0;
let HighScore = 0;


let gameOver = false;


const velocityX = -3;
let velocityY = 0;
const gravity = 0.1;
window.onload = function(){
    canvas = document.getElementById("canvas");
    canvas.width = boardWidth;
    canvas.height = boardHeight;
    context = canvas.getContext('2d');
    
    attackerImage = new Image();
    attackerImage.src = "./assets/messi.png";
    attackerImage.onload = function(){
        context.drawImage(attackerImage,attacker.x, attacker.y, attacker.width, attacker.height);
    }

    topDefenderImg = new Image();
    topDefenderImg.src = "./assets/ramos.webp"

    bottomDefenderImg = new Image();
    bottomDefenderImg.src = "./assets/ramos.webp";

    requestAnimationFrame(Update);
    setInterval(placeDefenders,2000);
    document.addEventListener("keydown",moveAttacker);
}
function Update(){
    requestAnimationFrame(Update);
    if(gameOver){
        return;
    }
    context.clearRect(0,0,canvas.width,canvas.height);
    
    velocityY += gravity;
    attacker.y = Math.max(attacker.y+velocityY,0);
    context.drawImage(attackerImage,attacker.x, attacker.y, attacker.width, attacker.height);

    if(attacker.y > canvas.height){
        gameOver = true
    }

    for(let i=0;i<defenderArray.length;i++){
        let defender = defenderArray[i];
        defender.x += velocityX;
        context.drawImage(defender.img,defender.x,defender.y,defender.width,defender.height);

        if(!defender.passed && attacker.x > defender.width+defender.x){
            score += 0.5;
            defender.passed = true;
        }

        if(detectCollision(attacker,defender)){
            gameOver = true;
            
        }
        
    }

    while(defenderArray.length >0 && defenderArray[0].x < -defenderWidth){
        defenderArray.shift()
    }

    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score,5,45);
    context.font = "25px sans-serif";
    context.fillText("HighScore: ",5,85);
    if(score > HighScore){
        context.fillText(score,130,85);
    }else{
        context.fillText(HighScore,130,85);
    }
    

    if(gameOver){
        context.font = "45px sans-serif";
        context.fillText("GAME OVER",20,320);
        context.fillText("Score:",20,360);
        context.fillText(score,155,360);
        context.fillText("High Score:",20,400);
        if(score> HighScore){
            context.fillText(score,255,400);
        }else{
            context.fillText(HighScore,255,400);
        }
        

    }
}
function placeDefenders(){

    if(gameOver){
        return;
    }
    const randomDefenderY = defenderY - defenderHeight/4 - Math.random() *defenderHeight/2;
    const openingSpace = canvas.height/4;
    const topDefender = {
        img : topDefenderImg,
        x : defenderX,
        y : randomDefenderY,
        width : defenderWidth,
        height : defenderHeight,
        passed : false,
    }
    defenderArray.push(topDefender);
    const bottomDefender = {
        img : bottomDefenderImg,
        x : defenderX,
        y : randomDefenderY + defenderHeight + openingSpace,
        width : defenderWidth,
        height : defenderHeight,
        passed : false,
    }
    
    defenderArray.push(bottomDefender);

}
function moveAttacker(e){
    if(e.code === "Space" || e.code === "ArrowUp"){

        velocityY = -4;

        if(gameOver){
            if(score > HighScore){
                HighScore = score;
            }
            attacker.y = attackerY;
            defenderArray=[];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a,b){
    return a.x <b.x + b.width &&
        a.x + a.width > b.x &&
        a.y <b.y + b.height &&
        a.y + a.height > b.y
}
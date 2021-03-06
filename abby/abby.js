// make crash with function work
//create break in every staircase
// create pause function
// score
//continuous staircases go all the way to bottom of canvas and appear gradually
// make so component can't leave canvas

function startGame() {
    myGameArea.start();
    myGamePiece = new Component(10, 10, "purple", 0, 200);
    generateMaze();

}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 400;
        this.canvas.height = 400;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function(e){
            myGameArea.key = e.keyCode;
        });
        window.addEventListener('keyup', function(e){
            myGameArea.key = false;
        })
    },
    clear: function(){
        this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
    },
    stop: function(){
        clearInterval(this.interval);
    }
};

function everyInterval(n){
    if((myGameArea.frameNo/n)%1==0){
        return true;
    }
    return false;
}
var myGamePiece;
//move piece other direction if it crashes
function Component(width, height, color, x, y){
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.update = function(){
        ctx = myGameArea.context;
        ctx.fillStyle=color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    this.newPos = function(){
        this.x += this.speedX;
        this.y += this.speedY;
    };
    this.crashWith = function(otherObj){
        var myLeft=this.x;
        var myRight = this.x + (this.width);
        var myTop = this.y;
        var myBottom = this.y + (this.height);
        var otherLeft = otherObj.x;
        var otherRight = otherObj.x + (otherObj.width);
        var otherTop = otherObj.y;
        var otherBottom = otherObj.y + (otherObj.height);
        var crash = true;
        if((myBottom < otherTop) || (myTop > otherBottom) || (myRight < otherLeft) || (myLeft > otherRight)){
            crash = false;
        }
        return crash;
    }
}

function Obstacle(width, height, x, y){
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.update = function(){
        ctx = myGameArea.context;
        ctx.fillStyle="blue";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    this.newPos = function(){
        this.x += this.speedX;
        this.y += this.speedY;
    };

}
//make each staircase a single obstacle
function updateGameArea(){
    for(var i=0; i<obs1.length; i++){
        if(myGamePiece.crashWith(obs1[i])){
            myGameArea.stop();
            document.getElementById("gameOver").innerHTML="Game over";
        }
    }

    var x, y;
    myGameArea.clear();

    if(!pause) {
        myGameArea.frameNo+=1;
    }else{
        myGameArea.frameNo+=0;
    }
    var pause = false;


    if(myGameArea.frameNo==1||everyInterval(400)){
         x=myGameArea.canvas.width;
         y=myGameArea.canvas.height;
         generateMaze();
    }
    for(var i = 0; i< obs1.length; i++){
        obs1[i].update();
        obs1[i].x+=-1;
    }

    for(var i=0; i<obs2.length; i++){
        obs2[i].update();
        obs2[i].x+=-1;
    }

    for(var i=0; i<obs3.length; i++){
        obs3[i].update();
        obs3[i].x+=-1;
    }

    if(myGameArea.key && myGameArea.key==37){
        myGamePiece.speedX = -1;
        pause = false;
    }
    if(myGameArea.key && myGameArea.key ==39){
        myGamePiece.speedX = 1;
        pause = false;
    }
    if(myGameArea.key && myGameArea.key == 38){
        myGamePiece.speedY = -1;
        pause = false;
    }
    if(myGameArea.key && myGameArea.key == 40){
        myGamePiece.speedY = 1;
        pause = false;
    }
    if(myGameArea.key && myGameArea.key == 32){
        stopMove();
        console.log(pause);
        if(pause) {
            pause = false;
        } else {
            pause = true;
        }
    }

    myGamePiece.newPos();
    myGamePiece.update();


}

function moveUp(){
    myGamePiece.speedY -= 1;
}

function moveDown(){
    myGamePiece.speedY += 1;
}

function moveLeft(){
    myGamePiece.speedX -= 1;
}

function moveRight(){
    myGamePiece.speedX += 1;
}

function stopMove(){
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
}

function generateMaze(){
    obs1 = [];
    widths = [15,20,25,30,45,50,55];
    heights = [15,20,25,30,35,45,50];
    gaps1 = [20,40,60,80,100,120,140,160,180,200,220,240,260,280,300,320,340,360,380];
    var obst1 = new Obstacle(10,10,0,0);
    obs1.push(obst1);
    var width=0;
    var height=0;
    var count = 0;
    var gap = gaps1[Math.floor(Math.random()*gaps1.length)];
    console.log(gap);
    //create at least one open space in each obstacle
    while (obs1[count].x+obs1[count].width<400 && obs1[count].y+obs1[count].height<400){
        var tempX=obs1[count].x;
        var tempWidth = obs1[count].width;
        var tempY = obs1[count].y;
        var tempHeight = obs1[count].height;
        if(count % 2 == 0){
            if(tempY>gap&&tempY<gap+tempHeight){
                height=heights[Math.floor(Math.random()*heights.length)];
                obs1.push(new Obstacle(10,height,tempX+tempWidth+20,tempY+30));
            }else{
                height=heights[Math.floor(Math.random()*heights.length)];
                obs1.push(new Obstacle(10,height,tempX+tempWidth,tempY));
            }
        }else{
            width=widths[Math.floor(Math.random()*widths.length)];
            obs1.push(new Obstacle(width,10,tempX,tempY+tempHeight));
    }
        count++;
    }
    console.log(obs1);

    obs2=[];
    gaps2=[20,40,60,80,100,120,140,160];
    gs2=[180,200,220,240,260,280,300,320,340,360,380];
    var obst2 = new Obstacle(30,10,150,0);
    obs2.push(obst2);
    var count2 = 0;
    var gap2 = gaps2[Math.floor(Math.random()*gaps2.length)];
    var g2=gs2[Math.floor(Math.random()*gs2.length)];
    console.log(gap2);
    while (obs2[count2].y+obs2[count2].height<400){
        tempX=obs2[count2].x;
        tempWidth = obs2[count2].width;
        tempY = obs2[count2].y;
        tempHeight = obs2[count2].height;
        if(count2 % 2 == 0){
            height=heights[Math.floor(Math.random()*heights.length)];
            obs2.push(new Obstacle(10,height,tempX+tempWidth,tempY));


        }else{
            if(tempY>gap2&&tempY<gap2+20){
                width=widths[Math.floor(Math.random()*widths.length)];
                obs2.push(new Obstacle(10,height,tempX+tempWidth+20,tempY+30));
            }else{
                width=widths[Math.floor(Math.random()*widths.length)];
                obs2.push(new Obstacle(width,10,tempX,tempY+tempHeight));
            }
        }
        count2++;
    }

    obs3=[];
    gaps3=[160,180,200,220,240,260,280,300,320,340,360,380];
    var obst3 = new Obstacle(20,15,0,150);
    var gap3 = gaps3[Math.floor(Math.random()*gaps3.length)];
    obs3.push(obst3);
    var count3=0;
    while(obs3[count3].y+obs3[count3].height<400){
        tempX=obs3[count3].x;
        tempWidth = obs3[count3].width;
        tempY = obs3[count3].y;
        tempHeight = obs3[count3].height;
        if(count3 % 2 == 0){
            if(tempY>gap3&&tempY<gap3+20){
                height=heights[Math.floor(Math.random()*heights.length)];
                obs3.push(new Obstacle(10,height,tempX+tempWidth+20,tempY+30));
            }else{
                height=heights[Math.floor(Math.random()*heights.length)];
                obs3.push(new Obstacle(10,height,tempX+tempWidth,tempY));
            }

        }else{
            width=widths[Math.floor(Math.random()*widths.length)];
            obs3.push(new Obstacle(width,10,tempX,tempY+tempHeight));
        }
        count3++;
    }

}


//inefficient hex to decimal conversion
function hexToDen1(hex) {
    var n1 = hex.substring(1, 2);
    console.log(n1);
    var n2 = hex.substring(2, 3);
    var den = 0;
    den += hexToDen2(n1);
    den+=hexToDen2(n2);
    return den;
}

function hexToDen2(hex) {
    var den=0;
    if(hex>=0 && hex<10){
        den+=parseInt(hex);
    }
    if(hex=="A"){
        den+=10;
    }
    if(hex=="B"){
        den+=11;
    }
    if(hex=="C"){
        den+=12;
    }
    if(hex=="D"){
        den+=13;
    }
    if(hex=="E"){
        den+=14;
    }
    if(hex=="F"){
        den+=15;
    }
    return den;
}

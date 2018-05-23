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
        }
    }

    var x, y;
    myGameArea.clear();
    myGameArea.frameNo+=1;

    if(myGameArea.frameNo==1||everyInterval(200)){
         x=myGameArea.canvas.width;
         y=myGameArea.canvas.height-200;
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
    }
    if(myGameArea.key && myGameArea.key ==39){
        myGamePiece.speedX = 1;
    }
    if(myGameArea.key && myGameArea.key == 38){
        myGamePiece.speedY = -1;
    }
    if(myGameArea.key && myGameArea.key == 40){
        myGamePiece.speedY = 1;
    }
    if(myGameArea.key && myGameArea.key == 32){
        stopMove();
        !(myGameArea.frameNo==1||everyInterval(250));
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
    gap = gaps1[Math.floor(Math.random()*gaps1.length)];
    //create at least one open space in each obstacle
    while (obs1[count].x+obs1[count].width<400 && obs1[count].y+obs1[count].height<400){
        var tempX=obs1[count].x;
        var tempWidth = obs1[count].width;
        var tempY = obs1[count].y;
        var tempHeight = obs1[count].height;
        if(count % 2 == 0){
            if(tempY>gap&&tempY<gap+20){
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
    gaps2=[160,180,200,220,240,260,280,300,320,340,360,380];
    var obst2 = new Obstacle(30,10,150,0);
    obs2.push(obst2);
    var count2 = 0;
    var gap2 = gaps2[Math.floor(Math.random()*gaps2.length)];
    while (obs2[count2].x+obs2[count2].width<400 && obs2[count2].y+obs2[count2].height<400){
        tempX=obs2[count2].x;
        tempWidth = obs2[count2].width;
        tempY = obs2[count2].y;
        tempHeight = obs2[count2].height;
        if(count2 % 2 == 0){
            height=heights[Math.floor(Math.random()*heights.length)];
            obs2.push(new Obstacle(10,height,tempX+tempWidth,tempY));


        }else{
            if(tempX>gap2&&tempX<gap2+20){
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
    while(obs3[count3].x+obs3[count3].width<400&&obs3[count3].y+obs3[count3].height<400){
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
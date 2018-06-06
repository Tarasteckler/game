
//player
var block1;
//green bars
var myObstacles=[];
//coins
var myCoins=[];
//score
var score;
//bonus score
var coinNum=0
//moving obstacles
var myBricks=[];

function startGame() {
    myGameArea.start();
    block1 = new BlockMaker(50, 30, "red", 0, 0);
    score = new BlockMaker("30px", "Consolas", "black", 280, 40, "text");

}

var myGameArea = {
    canvas : document.createElement("canvas"),

    start : function() {
        this.canvas.width = 600;
        this.canvas.height = 400;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        this.frameNo=0;
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
        stop : function() {
            clearInterval(this.interval);
        }


};
function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}



    function BlockMaker(width, height, color, x, y, type) {
        this.type=type
        this.width=width;
        this.height=height;
        this.x=x;
        this.y=y;
        this.speedX = 0;
        this.speedY = 0;
        this.update = function() {
            ctx = myGameArea.context;
            if (this.type == "text") {
                ctx.font = this.width + " " + this.height;
                ctx.fillStyle = color;
                ctx.fillText(this.text, this.x, this.y);
            }else {
                ctx.fillStyle = color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        }
         this.newPos = function() {
             this.x += this.speedX;
             this.y += this.speedY;
        };
        this.crashWith = function (crasher){
             var myleft=this.x;
             var myright=this.x + (this.width);
             var mytop=this.y;
             var mybottom=this.y+(this.height);
             var otherleft = crasher.x;
             var otherright = crasher.x + (crasher.width);
             var othertop = crasher.y;
             var otherbottom = crasher.y + (crasher.height);
             var crash=true;
             if ((mybottom < othertop) ||
                 (mytop > otherbottom) ||
                 (myright < otherleft) ||
                 (myleft > otherright)) {
                 crash = false;
             }
             return crash;
        }
}

function stopMove() {
    block1.speedX = 0;
    block1.speedY = 0;
}
function updateGameArea() {
    var x, y;
    //stops game if crash with obstacles
    for (i = 0; i < myObstacles.length; i += 1) {
        if (block1.crashWith(myObstacles[i])) {
            myGameArea.stop();
            return;
        }
    }
    //removes coins and adds 10 points if crash with coin
    for (i = 0; i < myCoins.length; i++) {
        if (block1.crashWith(myCoins[i])) {
            myCoins.splice(i);
            coinNum += 10
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        y = myGameArea.canvas.height - 200;
        var minHeight = 20;
        var maxHeight = 200;
        var height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);

        //determines verticle space between obstacles and adds them to array
        var minGap = 50;
        var maxGap = 200;
        var gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        myObstacles.push(new BlockMaker(10, x - height - gap, "green", x, height + gap));
        myObstacles.push(new BlockMaker(10, height, "green", x, 0));

        //creates random coins
        var coinx = Math.floor(Math.random() * x);
        var coiny = Math.floor(Math.random() * y);
        myCoins.push(new BlockMaker(15, 15, "yellow", coinx, coiny));
    }


    //creates random moving bricks
    var brickx = Math.floor(Math.random() * x);
    myBricks.push(new BlockMaker(10, 10, "red", brickx, 0));

    //controls speed green blocks move across the page
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -2;
        myObstacles[i].update();
    }

    //controls speed coins move across the page

    for (i = 0; i < myCoins.length; i += 1) {
        myCoins[i].x += -2;
        myCoins[i].update();
    }

    //controls speed of bricks across page
    for (i = 0; i < myBricks.length; i += 1) {
        myBricks[i].x += -2;
        myBricks[i].y+=1;
        myBricks[i].update();
    }

        //sets score
        score.text = "SCORE: " + Math.floor((((myGameArea.frameNo) / 100) + coinNum));
        score.update();

        block1.newPos();
        block1.update();
    }

    //keyboard controls

    function moveup() {
        block1.speedY -= 1;
    }

    function movedown() {
        block1.speedY += 1;
    }

    function moveright() {
        block1.speedX += 1;
    }

    function moveleft() {
        block1.speedX -= 1;
    }

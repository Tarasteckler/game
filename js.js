var block;
var obstacles = [];
var score;

function startGame() {
    myGameArea.start();
    myScore = new Component("15px", "Consolas", "black", 10, 20,'text');
    block = new Component(30, 30, "smiley.gif", 10, 120, "image");
    obstacle = new Component (10, 200, "green", 300, 100);
}

//constructor called Component
function Component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    // ctx = myGameArea.context;
    //ctx.fillStyle = color;
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    this.update = function(){
        ctx = myGameArea.context;
        if (type == "image") {
            ctx.drawImage(this.image,
                this.x,
                this.y,
                this.width, this.height);
        }
        // if (this.type == "text") {
        //     ctx.font = this.width + " " + this.height;
        //     ctx.fillStyle = color;
        //     ctx.fillText(this.text, this.x, this.y);
        // }
        else{
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

    };
    this.newPos = function(){
        this.x += this.speedX;
        this.y += this.speedY;
    };

    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

//object called myGameArea
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        //interval is making it so that the updateGameArea function runs every 20th of a millisecond, or 50 times a second.
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.key = e.keyCode;
        });
        window.addEventListener('keyup', function (e) {
            myGameArea.key = false;
        })
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
};

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {
        return true;
    }else{
        return false;
    }

}

function updateGameArea(){
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;

    for (i = 0; i < obstacles.length; i += 1){
        if (block.crashWith(obstacles[i])){
            myGameArea.stop();
            return;
        }
    }

    myGameArea.clear();
    myGameArea.frameNo += 1;

    if (myGameArea.frameNo == 1 || everyinterval(150)){
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        obstacles.push(new Component(10, height, "orange", x, 0));
        obstacles.push(new Component (10, x - height - gap, "orange", x, height + gap));
    }

    for (i=0; i < obstacles.length; i ++){
        obstacles[i].x -= 1;
        obstacles[i].update();
    }

    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.update();
    block.speedX = 0;
    block.speedY = 0;
    if (myGameArea.key && myGameArea.key == 37) {block.speedX = -1.5; }
    if (myGameArea.key && myGameArea.key == 39) {block.speedX = 1.5; }
    if (myGameArea.key && myGameArea.key == 38) {block.speedY = -1.5; }
    if (myGameArea.key && myGameArea.key == 40) {block.speedY = 1.5; }
    block.newPos();
    block.update();

}

function restart(){

}


//functions for buttons that I removed
// function moveUp(){
//     pinkPiece.speedY -= 1;
// }
//
// function moveDown(){
//     pinkPiece.speedY += 1;
// }
//
// function moveRight(){
//     pinkPiece.speedX += 1;
// }
//
// function moveLeft(){
//     pinkPiece.speedX -= 1;
// }
//
// function stopMove(){
//     pinkPiece.speedX = 0;
//     pinkPiece.speedY = 0;
// }
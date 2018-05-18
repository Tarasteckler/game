var block;
var obstacles = [];
var score;
var scores = [0];
var highScore;
var myBackground;

// var spaceJump = document.getElementById("jump");
// window.addEventListener("keydown", function(){
//     if(myGameArea.keyCode === 32){
//         accelerate(-0.2);
//     }
// });
// window.addEventListener("keyup", function(){
//     if(myGameArea.keyCode === 32){
//         accelerate(0.1);
//     }
// });


function startGame() {
    document.getElementById("restartdiv").innerHTML = "";
    score = new Component("15px", "Consolas", "black", 10, 20,'text');
    block = new Component(25, 35, "img/bean.png", 10, 120, 'image');
    block.gravity = 0;
    highScore = new Component("15px", "Consolas", "black", 10, 45, 'text');
    myBackground = new Component(656, 290, "img/city.jpg", 0, 0, "background");
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 500;
        this.canvas.height = 290;
        this.context = this.canvas.getContext("2d");
        document.getElementById("divcanvas").appendChild(this.canvas);
        this.frameNo = 0;
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


function Component(width, height, color, x, y, type) {
    this.type = type;
    if (type === "image" || type === "background") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function(){
        ctx = myGameArea.context;
        if (type === "image" || type === "background") {
            ctx.drawImage(this.image,
                this.x,
                this.y,
                this.width, this.height);
            if (type === "background"){
                ctx.drawImage(this.image,
                    this.x + this.width,
                    this.y,
                    this.width, this.height)
            }
        }else if (this.type === "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }
        else{
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        if (this.type === "background"){
            if(this.x === -(this.width)){
                this.x = 0;
            }
        }
        this.hitBottom();
    };

    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
            myGameArea.stop();
            document.getElementById("restartdiv").innerHTML = "<br> Oh no! You died. Try again!<br> <br><button id='restart' onclick=\"restart()\">Restart</button>\n";
            scores.push(myGameArea.frameNo);
            console.log(scores);
            scores.sort(function(a, b){return b - a});
        }
        if(myGameArea.frameNo > 2 && this.y < 0){
            myGameArea.stop();
            document.getElementById("restartdiv").innerHTML = "<br> Oh no! You died. Try again!<br> <br><button id='restart' onclick=\"restart()\">Restart</button>\n";
            scores.push(myGameArea.frameNo);
            console.log(scores);
            scores.sort(function(a, b){return b - a});
        }
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
    };
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 === 0) {
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
            document.getElementById("restartdiv").innerHTML = "<button id='restart' onclick=\"restart()\">Restart</button>\n";
            scores.push(myGameArea.frameNo);
            console.log(scores);
            scores.sort(function(a, b){return b - a});
            return;
        }
    }

    myGameArea.clear();
    myBackground.speedX = -1;
    myGameArea.frameNo += 1;
    myBackground.newPos();
    myBackground.update();



    if (myGameArea.frameNo === 1 || everyinterval(150)){
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random() * ( maxGap - minGap + 1) + minGap);
        obstacles.push(new Component(10, height, "purple", x, 0));
        obstacles.push(new Component (10, x - height - gap, "purple", x, height + gap));
    }

    for (i = 0; i < obstacles.length; i ++){
        obstacles[i].x -= 1;
        obstacles[i].update();
    }

    score.text = "SCORE: " + myGameArea.frameNo;
    score.update();
    highScore.text= "HIGH SCORE: " + scores[0];
    highScore.update();
    block.newPos();
    block.update();

}

function accelerate(n) {
    if (!myGameArea.interval){
        myGameArea.interval = setInterval (updateGameArea, 20);
    }
    block.gravity = n;
}

function restart(){
    myGameArea.clear();
    block.frameNo = 0;
    myGameArea.frameNo = 0;
    myGameArea.interval = 0;
    block.x = 0;
    block.y = 120;
    block.speedX = 0;
    block.speedY = 0;
    obstacles = [];
    startGame();
    console.log(myGameArea.interval);
}


var block;
var obstacles = [];
var score;
var scores = [0];
var highScore;
// var myBackground;

// var spaceClick = document.getElementById("spaceClick");
// spaceClick.addEventListener("keyup", function(event){
//     event.preventDefault();
//     if(event.keyCode === 13 || event.keyCode === 32){
//         document.getElementById("spaceClick").click();
//     }
// });


function startGame() {
    document.getElementById("buttonSpace").innerHTML = "";
    score = new Component("15px", "Consolas", "black", 10, 20,'text');
    block = new Component(30, 30, "hotpink", 10, 120);
    block.gravity = 0;
    highScore = new Component("15px", "Consolas", "black", 10, 45, 'text');
    myGameArea.start();

    // myBackground = new Component(656, 270, "starry.jpg", 0, 0, "image");
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
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
    if (type === "image") {
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
        if (type === "image") {
            ctx.drawImage(this.image,
                this.x,
                this.y,
                this.width, this.height);
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
        this.hitBottom();
    };

    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        // var rocktop = 0;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
            myGameArea.stop();
            document.getElementById("buttonSpace").innerHTML = "<button onclick=\"restart()\">Restart</button>\n";
            scores.push(myGameArea.frameNo);
            console.log(scores);
            scores.sort(function(a, b){return b-a});
            //getHighScore();
        }
        // if(block.y === 0){
        //     this.gravitySpeed = 0;
        //     myGameArea.stop();
        // }
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

// function getHighScore(){
//     scores.sort(function(a, b){return b-a});
//     // highScore = scores[0];
//     // console.log(highScore);
// }

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
            document.getElementById("buttonSpace").innerHTML = "<button onclick=\"restart()\">Restart</button>\n";
            scores.push(myGameArea.frameNo);
            console.log(scores);
            scores.sort(function(a, b){return b-a});
            return;
        }
    }

    myGameArea.clear();
    myGameArea.frameNo += 1;

    if (myGameArea.frameNo === 1 || everyinterval(150)){
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

    for (i = 0; i < obstacles.length; i ++){
        obstacles[i].x -= 1;
        obstacles[i].update();
    }

    score.text = "SCORE: " + myGameArea.frameNo;
    score.update();
    highScore.text= "HIGH SCORE: " + scores[0];
    highScore.update();

    // block.speedX = 0;
    // block.speedY = 0;
    // if (myGameArea.key && myGameArea.key == 37) {block.speedX = -2; }
    // if (myGameArea.key && myGameArea.key == 39) {block.speedX = 2; }
    // if (myGameArea.key && myGameArea.key == 38) {block.speedY = -2; }
    // if (myGameArea.key && myGameArea.key == 40) {block.speedY = 2; }

    // if (myGameArea.key === 32) {accelerate(-0.2);}

    block.newPos();
    block.update();
    // myBackground.newPos();
    // myBackground.update();
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
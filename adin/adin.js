
//player
var block1;
//green bars
var myObstacles=[];
//coins
var myCoins=[];
//score
var score;
//bonus score
var coinNum=0;
//moving obstacles
var myBricks=[];
//score of all scores
var allScores=[];

function startGame() {
    document.getElementById("restart").style.visibility = "hidden";
    myGameArea.start();
    block1 = new BlockMaker(50, 50, "imgFolder/alby.png", 30, 250, "image");
    score = new BlockMaker("18px", "Consolas", "black", 850, 40, "text");
    highScore=new BlockMaker("19px", "Consolas", "black", 850, 80, "text");

}

var myGameArea = {
    canvas : document.createElement("canvas"),

    start : function() {
        this.canvas.width = 1000;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.key = e.keyCode;
        });

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
        this.type = type;
        if (type == "image") {
            this.image = new Image();
            this.image.src = color;
        }
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.speedX = 0;
        this.speedY = 0;

        this.update = function () {
            ctx = myGameArea.context;
            if (type == "image") {
                ctx.drawImage(this.image,
                    this.x,
                    this.y,
                    this.width, this.height);
            } else
                if (this.type == "text") {
                    ctx.font = this.width + " " + this.height;
                    ctx.fillStyle = color;
                    ctx.fillText(this.text, this.x, this.y);
                } else {
                    ctx.fillStyle = color;
                    ctx.fillRect(this.x, this.y, this.width, this.height);
                }
            }

            this.newPos = function () {
                this.x += this.speedX;
                this.y += this.speedY;
            };


        //crash detector
        this.crashWith = function (crasher) {
                var myleft = this.x;
                var myright = this.x + (this.width);
                var mytop = this.y;
                var mybottom = this.y + (this.height);
                var otherleft = crasher.x;
                var otherright = crasher.x + (crasher.width);
                var othertop = crasher.y;
                var otherbottom = crasher.y + (crasher.height);
                var crash = true;
                if ((mybottom < othertop+5) ||
                    (mytop > otherbottom-5) ||
                    (myright < otherleft+5) ||
                    (myleft > otherright+5)) {
                    crash = false;
                }
                return crash;
            }
        };

        function stopMove() {
            block1.speedX = 0;
            block1.speedY = 0;
        }

        function updateGameArea() {
            var x, y;
            if (myGameArea.key && myGameArea.key == 38) {block1.speedY = -(1+myGameArea.frameNo/350); }
            console.log(1+myGameArea.frameNo/350);
            if (myGameArea.key && myGameArea.key == 40) {block1.speedY = (1+myGameArea.frameNo/350); }

            //removes coins and adds 10 points if crash with coin
            for (i = 0; i < myCoins.length; i++) {
                if (block1.crashWith(myCoins[i])) {
                    myCoins.splice(i);
                    coinNum += 10
                }
            }

            //stops games if crash with red bricks
            for (var i = 0; i < myBricks.length; i++) {
                if (block1.crashWith(myBricks[i])) {
                    myGameArea.stop();
                    allScores.push(Math.floor((((myGameArea.frameNo) / 100) + coinNum)));
                    gameOver();
                    //displays restart button
                    document.getElementById("restart").style.visibility = "visible";
                    return;
                }
            }

            //stops game if crash with obstacles
            for (i = 0; i < myObstacles.length; i++) {
                if (block1.crashWith(myObstacles[i])) {
                    myGameArea.stop();
                    allScores.push(Math.floor((((myGameArea.frameNo) / 100) + coinNum)));
                    gameOver();
                    //displays restart button
                    document.getElementById("restart").style.visibility = "visible";
                    return;
                }
            }

            //stops game if go off screen
            if (block1.y<0||block1.y>450){
                myGameArea.stop();
                allScores.push(Math.floor((((myGameArea.frameNo) / 100) + coinNum)));
                gameOver();
                //displays restart button
                document.getElementById("restart").innerHTML=("Restart");
                return;
            }

            function gameOver(){
                gameOver=new BlockMaker("40px", "Consolas", "black", 400, 250, "text");
                gameOver.text="GAME OVER";
                gameOver.update();
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
                var minGap = 150;
                var maxGap = 300;
                var gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
                myObstacles.push(new BlockMaker(10, x - height - gap, "green", x, height + gap));
                myObstacles.push(new BlockMaker(10, height, "green", x, 0));

                //creates random coins
                var coinx = Math.floor(Math.random() * x);
                var coiny = Math.floor(Math.random() * y);
                myCoins.push(new BlockMaker(30, 30, "imgFolder/ball.jpg", coinx, coiny, "image"));

                //creates random moving bricks
                var brickx = Math.floor(Math.random() * x);
                myBricks.push(new BlockMaker(30, 30, "imgFolder/ib.png", brickx, 0, "image"));
            }


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
            for (i = 0; i < myBricks.length; i++) {
                myBricks[i].x += -2;
                myBricks[i].y += 1;
                myBricks[i].update();
            }

            //sets score
            score.text = "SCORE: " + Math.floor((((myGameArea.frameNo) / 100) + coinNum));
            score.update();

            //sets high score
            var max=0;
            for (i = 0; i < allScores.length; i++) {
                if (allScores[i]>max){
                    max=allScores[i];
                }
            }
            highScore.text = "High Score: " + max;
            highScore.update();

            //console.log(max);


            block1.newPos();
            block1.update();
        }


function restart() {
    myGameArea.clear();
    myBricks=[];
    myObstacles = [];
    myCoins=[];
    block1.frameNo = 0;
    myGameArea.frameNo = 0;
    myGameArea.interval = 0;
    block1.x = 0;
    block1.y = 0;
    block1.speedX = 0;
    block1.speedY = 0;
    coinNum=0;

    startGame();
}

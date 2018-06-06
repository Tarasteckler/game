
var myGamePiece;
var myObstacles = [];
var mySeaweed = [];
var myOctopus = [];
var myCoins = [];
var myBubbles = [];
var myRuns = [];
var myScore;
var starCount = 0;
var myStarScore;
var myName= "";
var mySound;
var myMusic;


function startGame() {
    document.getElementById("scoreboard").style.display = "none";
    document.getElementById("nameID").innerHTML = "<input type=\"text\" id=\"name\" value=\"\" size=\"25\" placeholder=\"Type Nickname Here\">\n" +
        "<button onclick=\"enterName()\" class=\"btn btn-danger\">Submit</button>";
    myName = "";
    myGamePiece = new component(60, 48, "images/submarine.png", 10, 120, "image");
    myScore = new component("25px", "Consolas", "black", 240, 40, "text");
    myStarScore = new component("25px", "Consolas", "black", 500, 40, "text");
    mySound = new sound("music/coinSound.wave");
    myMusic = new sound("music/background.mp3");
    myGameArea.start();
}

function enterName() {
    myName = document.getElementById("name").value;
    if (!myName) {
        myName = "Guest User";
    }
    document.getElementById("nameID").innerHTML = "Welcome, " + myName + "!";
    document.getElementById("nameID").style.color = "white";
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        myMusic.play();

        document.getElementById('restart').style.display = 'inline';
        document.getElementById("continue").disabled = true;
        starCount=0;
        document.getElementById("continue").disable = true;
        document.getElementById('div').style.display = 'inline';
        document.getElementById('restart').style.display = 'none';
        this.canvas.width = 800;
        this.canvas.height = 400;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.key = false;
        })
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        myMusic.stop();
        document.getElementById('restart').style.display = 'none';
        clearInterval(this.interval);
        document.getElementById('continue').disable = false;
        document.getElementById('div').style.display = 'none';
        document.getElementById('restart').style.display = 'inline';

        //local storage stuff
        myRuns.push (new run(starCount, myGameArea.frameNo, myName));
        save(myRuns[myRuns.length-1],myName);
        console.log("recent: " + reload(myName));

        var topScores = getAll();
        console.log("all: " + typeof topScores);



        topScores = topScores.sort(compare);
        topScores = topScores.reverse();
        document.getElementById("scoreboard").style.display = "block";

        var t = "";
        t ="<table   id='scoreTable' class='table'>";
        t+= "<tr><td>Ranking</td>";
        t+= "<td>Name</td>";
        t += "<td>" + 'Score' + "</td>";
        t += "<td>" + 'Star Score' + "</td></tr>";

        for(var i = 0; i< 3; i++) {
            // var rank = i+=1;
            var name = topScores[i].name;
            var score = topScores[i].score;
            var starScore =  topScores[i].starCount;
            t += "<tr><td>" + i + "</td>";
            t += "<td>" + name + "</td>";
            t += "<td>" + score + "</td>";
            t += "<td>" + starScore + "</td></tr>";
        }
        t+="</table>";
        document.getElementById("scoreboard").innerHTML = t;


    },
    pause : function(){
        myMusic.stop();

        document.getElementById('restart').style.display = 'none';
        document.getElementById("continue").disabled = false;
        clearInterval(this.interval);
        document.getElementById('restart').style.display = 'inline';
    }

}

function run(starCount, score, name){
    this.starCount = starCount;
    this.score = score;
    this.name = name;

}

function component(width, height, color, x, y, type) {
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
    this.update = function() {
        ctx = myGameArea.context;
        if (type == "image") {
            ctx.drawImage(this.image,
                this.x,
                this.y,
                this.width, this.height);
        } else {
            if (this.type == "text") {
                ctx.font = this.width + " " + this.height;
                ctx.fillStyle = color;
                ctx.fillText(this.text, this.x, this.y);
            }else{
                ctx.fillStyle = color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        }
    }


    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
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
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function starSpeed(){

}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

function updateGameArea() {
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    //left
    if (myGameArea.key && myGameArea.key == 37 && myGamePiece.x >= 0) {myGamePiece.speedX = -3; }
    //right
    if (myGameArea.key && myGameArea.key == 39 && myGamePiece.x <= 800) {myGamePiece.speedX = 6; }
    //up
    if (myGameArea.key && myGameArea.key == 38 && myGamePiece.y >= 70 && myGamePiece.y <= 400) {myGamePiece.speedY = -2; }
    //down
    if (myGameArea.key && myGameArea.key == 40 && myGamePiece.x >= 0 && myGamePiece.x <=800) {myGamePiece.speedY = 2; }
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;

    for (i = 0; i < myCoins.length; i += 1) {
        if(myGamePiece.crashWith(myCoins[i])){
            myCoins[i] = new component(1, 1, "", 1, 1, "");
            mySound.play();
            starCount +=1;
            myGameArea.update()
        }
    }

    for (i = 0; i < mySeaweed.length; i += 1) {
        if (myGamePiece.crashWith(mySeaweed[i])) {
            myGameArea.stop();
            return;
        }
    }
    for (i = 0; i < myOctopus.length; i += 1) {
        if (myGamePiece.crashWith(myOctopus[i])) {
            myGameArea.stop();
            return;
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        var y = myGameArea.canvas.height;
        minHeight = 10;
        maxHeight = 300;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        var z = Math.floor(Math.random() * y) + 70;
        var coinPos = Math.floor(Math.random() * y) + 80;
        var bubSize = Math.floor(Math.random() * 30) + 10;
        var bubPos1 = Math.floor(Math.random() * 300) + 400;
        var bubPos2 = Math.floor(Math.random() * 300) + 400;
        myOctopus.push(new component(40, 40, "images/octopus.png", x + 50, z, "image"));
        mySeaweed.push(new component(70, 100, "images/seaweed.png", x, 320, "image"));
        // myCoins.push(new component(20, 20, "star.png", x + 50, coinPos, "image"));
        myCoins.push(new component(20, 20, "images/star.png", bubPos2 +5 , 325, "image"));
        myBubbles.push(new component(30, 30, "images/bubble.png", bubPos2, 320, "image"))
        myBubbles.push(new component(bubSize, bubSize, "images/bubble.png", bubPos1, 300, "image"))
    }
    for (i = 0; i < mySeaweed.length; i += 1) {
        mySeaweed[i].speedX = -1;
        mySeaweed[i].newPos();
        mySeaweed[i].update();
    }
    for (i = 0; i < myOctopus.length; i += 1) {
        myOctopus[i].speedX = -1;
        myOctopus[i].speedX = -1;
        myOctopus[i].newPos();
        myOctopus[i].update();
    }

    for (i = 0; i < myCoins.length; i += 1) {
        myCoins[i].speedX = -1;
        myCoins[i].speedY = -1;
        myCoins[i].newPos();
        myCoins[i].update();
    }

    for (i = 0; i < myBubbles.length; i += 1) {
        myBubbles[i].speedX = -1;
        myBubbles[i].speedY = -1;
        myBubbles[i].newPos();
        myBubbles[i].update();
    }

    myScore.text="SCORE: " + myGameArea.frameNo;
    myStarScore.text="STARS: " + starCount;
    myStarScore.update();
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;

}

//this will save an array of objects to a local storage
function save(array, name) {
    console.log(typeof array);
    var json = JSON.stringify(array);
    console.log(typeof json);
    localStorage.setItem(name, json);
}

//this retrieves data from local storage
function reload(name) {
    var text = localStorage.getItem(name);
    var obj = JSON.parse(text);
    return obj;
}

function getAll() {
    //push items into an array and return
    var myTopScores = [];
    for ( var i = 0, len = localStorage.length; i < len; ++i ) {
        //console.log(typeof localStorage.getItem( localStorage.key( i ) ));
        myTopScores.push( JSON.parse(localStorage.getItem( localStorage.key( i ) ) ) );
        //console.log(typeof myTopScores[myTopScores.length-1])
    }
    return myTopScores;
    console.log(myTopScores)
}

//custom comparator for scores
function compare(a,b) {
    if (a.score < b.score)
        return -1;
    if (a.score > b.score)
        return 1;
    return 0;
}
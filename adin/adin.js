
var block1;
//var block2;

function startGame() {
    myGameArea.start();

    block1 = new BlockMaker(50, 30, "red", 0, 300);
    //block2 = new BlockMaker(30, 30, "blue", 0, 100);



}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 600;
        this.canvas.height = 400;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};



    function BlockMaker(width, height, color, x, y)   {
        this.width=width;
        this.height=height;
        this.color=color;
        this.x=x;
        this.y=y;
        this.speedX = 0;
        this.speedY = 0;
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        this.update = function(){
            ctx = myGameArea.context;
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        };
         this.newPos = function() {
             this.x += this.speedX;
             this.y += this.speedY;
        }
}
function stopMove() {
    block1.speedX = 0;
    block1.speedY = 0;
}
    function updateGameArea() {
        myGameArea.clear();
        block1.newPos();
        block1.update();


    }

    //keyboard controls

function moveup(){
    block1.speedY-=1;
}
function movedown(){
    block1.speedY+=1;
}

function moveright(){
    block1.speedX+=1;
}

function moveleft(){
    block1.speedX-=1;
}
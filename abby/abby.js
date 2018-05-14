function startGame(){
    myGameArea.start();
    myGamePiece = new Component(30,30,"purple", 10, 120);
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 600;
        this.canvas.height = 400;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function(){
        this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
    }
}

var myGamePiece;

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
    }

}

function updateGameArea(){
    myGameArea.clear();
    myGamePiece.newPos();
    myGamePiece.update();
}

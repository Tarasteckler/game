//red = ["#FEF1F2","#FAD2D4","#F5A4A8","#F1767C","#EC4850","#E82A32","#D91720","#BA141B","#9C1017","#7D0D12","#6E0C10","#4F080C"];
//fffafa to ff0000
red=["#ff0000"];
green = ["#44FF8A","#43F585","#40EC80","#3DDB78","#38C96E","#33B262","#2D9955","#268148","#206F3D","#17502C"];
blue = ["#17C8FF","#15BFF3","#14B6E8","#12A9D7","#1197C0","#1089AF","#0F7A9B","#0E6F8D","#0C617B","#0B546B","#094355"];
selected = 0;
currentColor="";

//https://htmlcolorcodes.com/
//color sort
//function to change hex to denary
//squares swap places when clicked
//check for ascending array after each swap
//make slider for difficulty that determines how far apart the colors are
//https://www.w3schools.com/howto/howto_js_rangeslider.asp
//algorithm to calculate minimum number of swaps necessary

$(document).ready(function(){

    $("#red").click(function(){
        $("#verif").text("");
        currentColor="red";
        displayColors(red);
        console.log(red);
    });

    $("#green").click(function(){
        $("#verif").text("");
        currentColor="green";
        displayColors(green);
    });
    $("#blue").click(function(){
        $("#verif").text("");
        currentColor="blue";
        displayColors(blue);
    });

    $(".colors").click(function (){
        selected++;
        $(".selected").removeClass('selected');
        $(this).addClass('selected');
        swapColors();
    });
    $("#check").click(function(){
        $("#verif").text("");
       checkSort();
    });

});

function getColors(){
    var slider=$("#hexRange").val();
    if(currentColor=="red"){
        var b=parseInt(slider);
        for(var i=0; i<250/slider; i++){
            red.push("#ff"+denToHex(b)+denToHex(b));
            b+=parseInt(slider);
        }
    }
}

function displayColors(arr){
    getColors();
    var colorsUsed = [];
    while (colorsUsed.length<9){
        var color = arr[Math.floor(Math.random()*arr.length)];
        if(colorsUsed.indexOf(color)==-1){
            colorsUsed.push(color);
        }
    }
    for(var j=0; j<9; j++){
        $("#c"+j).css("background-color",colorsUsed[j]);
    }
}

function swapColors(){
    if(selected==1){
        color1=$(".selected").css("background-color");
        console.log(color1);
        div1=$(".selected").attr("id");
        console.log(div1)
    }
    if(selected==2){
        color2=$('.selected').css("background-color");
        div2=$('.selected').attr("id");
        console.log(color2);
        console.log(div2);
        $("#"+div1).css("background-color",color2);
        $("#"+div2).css("background-color",color1);
        color1="";
        color2="";
        div1="";
        div2="";
        selected=0;
        $('.selected').removeClass('selected');
    }


    //highlight selected colors on click
    //get RGB val on click
    //swap RGB vals
}

function checkSort(){
    var correctSwaps=0;
    for(var i=0; i<8; i++){
        var j=i+1;
        if(currentColor=="red"){
            var prev=getG("#c"+i);
            var next=getG("#c"+j);
        }
        if(currentColor=="green"){
            var prev=getR("#c"+i);
            var next=getR("#c"+j);
        }
        if(currentColor=="blue"){
            var prev=getB("#c"+i);
            var next=getB("#c"+j);
        }

        if(prev<next){
            $("#verif").text('wrong order, try again');

        }else{
            correctSwaps++;
        }
        //make sure check swap looks at all comparisons
        if(prev>next&&correctSwaps==8){
            $("#verif").text('good job');
        }
    }
}

function getR(id){
    var rgb=$(id).css("background-color");
    console.log(rgb);
    var r=parseInt(rgb.substring(4,7));
    console.log(r);
    return r;
}

function getG(id){
    var rgb=$(id).css("background-color");
    var g=parseInt(rgb.substring(8,12));
    return g;
}

function getB(id){
    var rgb=$(id).css("background-color");
    var b=parseInt(rgb.substring(12));
    return b;
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

function denToHex(den){
    var hex="";
    var hexDigits=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
    if(den%16==0){
        console.log(hexDigits[Math.floor(den/16)]);
        hex+=hexDigits[Math.floor(den/16)];
        console.log(hex);
        hex+="0";
    }
    if(den%16!=0){
        console.log(hexDigits[Math.floor(den/16)+1]);
        hex += hexDigits[Math.floor(den/16)];
        hex += hexDigits[Math.floor(den%16)];
    }
    return hex;
}
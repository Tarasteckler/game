red=[];
green=[];
blue=[];
selected = 0;
currentColor="";

//background-image: url("https://www.sessions.edu/wp-content/themes/divi-child/color-calculator/wheel-5-ryb.png");
//https://htmlcolorcodes.com/
//color sort
//function to change hex to denary
//squares swap places when clicked
//check for ascending array after each swap
//make slider for difficulty that determines how far apart the colors are
//https://www.w3schools.com/howto/howto_js_rangeslider.asp
//algorithm to calculate minimum number of swaps necessary

//if 31<slider<=35, 7 spaces
//if 27<slider<=31, 8 spaces
//if 4<slider<=27, 9 spaces

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
//condense range for hard setting
    $(".slideContainer").on("change", function(){
        if(currentColor=="red"){
            red=[];
            displayColors(red);
            console.log(red);
        }
        if(currentColor=="green"){
            green=[];
            displayColors(green);
        }
        if(currentColor=="blue"){
            blue=[];
            displayColors(blue);
        }

    });

});

function getColors(){
    var slider=$("#hexRange").val();
    if(currentColor=="red"){
        var b=parseInt(slider);
        for(var i=0; i<250/slider-1; i++){
            red.push("#ff"+denToHex(b)+denToHex(b));
            b+=parseInt(slider);
        }
    }
    if(currentColor=="green"){
        var r=parseInt(slider);
        for(var j=0; j<250/slider-1; j++){
            green.push("#"+denToHex(r)+"ff"+denToHex(r));
            r+=parseInt(slider);
        }
    }
    if(currentColor=="blue"){
        var g=parseInt(slider);
        for(var k=0; k<250/slider-1; k++){
            blue.push("#"+denToHex(g)+denToHex(g)+"ff");
            g+=parseInt(slider);
        }
    }
}

function displayColors(arr){
    getColors();
    var colorsUsed = [];
    var slider=parseInt($("#hexRange").val());
    if(250/slider-1>8){
        while (colorsUsed.length<9){
            var color = arr[Math.floor(Math.random()*arr.length)];
            if(colorsUsed.indexOf(color)==-1){
                colorsUsed.push(color);
            }
        }
        for(var j=0; j<9; j++){
            $("#c"+j).css("background-color",colorsUsed[j]);
        }
    }else{
        while(colorsUsed.length<250/slider-1){
            var color = arr[Math.floor(Math.random()*arr.length)];
            if(colorsUsed.indexOf(color)==-1){
                colorsUsed.push(color);
            }
        }
        $(".colors").css("background-color", "transparent");
        for(var k=0; k<250/slider-1; k++){
            $("#c"+k).css("background-color",colorsUsed[k]);
        }
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
    var slider=parseInt($("#hexRange").val());
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
            var prev=getG("#c"+i);
            var next=getG("#c"+j);
        }

        if(prev<next){
            $("#verif").text('Wrong order - try again.');

        }
        if(prev>next){
            correctSwaps++;
        }
        //make sure check swap looks at all comparisons
        if(slider<=27){
            if(prev>next&&correctSwaps==8){
                $("#verif").text('Good job!');
            }
        }
        if(slider>27 && slider<=32){
            if(prev>next&&correctSwaps==7){
                $("#verif").text('Good job!');
            }
        }
        if(slider>31){
            if(prev>next&&correctSwaps==6){
                $("#verif").text('Good job!');
            }
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

//fix substring so it works for 1, 2, and 3-digit b values

function denToHex(den){
    var hex="";
    var hexDigits=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
    if(den%16==0){
        hex+=hexDigits[Math.floor(den/16)];
        hex+="0";
    }
    if(den%16!=0){
        hex += hexDigits[Math.floor(den/16)];
        hex += hexDigits[Math.floor(den%16)];
    }
    return hex;
}

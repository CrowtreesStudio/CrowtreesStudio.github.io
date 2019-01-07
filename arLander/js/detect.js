var timer = setInterval(testHere, 1000);

function testHere(){
    if(document.querySelector("#one").object3D.visible != true){
        console.log("Not visible");
        document.getElementById("message1").style.visibility = "hidden";
    }else{
        console.log("visible");
        document.getElementById("message1").style.visibility = "visible";
        
    }
}

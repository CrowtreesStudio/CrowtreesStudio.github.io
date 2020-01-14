window.setInterval(testHere(), 1000);

var it = document.querySelector('#one')

function testHere(){
    console.log("Hello");
    it.style.left = "50%";
    if(document.querySelector("#one")){
        console.log("Yup, he's here...");
    };
}

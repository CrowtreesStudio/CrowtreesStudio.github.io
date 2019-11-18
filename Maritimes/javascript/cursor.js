AFRAME.registerComponent('clickme', {
    init: function () {
        var lastIndex = -1;
        var COLORS = ['purple', 'green', 'blue'];
        this.el.addEventListener('click', function (evt) {
            lastIndex = (lastIndex + 1) % COLORS.length;
            this.setAttribute('material', 'color', COLORS[lastIndex]);
//            console.log('I was clicked at: ', evt.detail.intersection.point);
        });
    }
});

function hidePlay(){
    
    //hide button and colour screen
    console.log("Play sound and hide me!");
    document.getElementById("begin").style.display = "none";
//    document.getElementById("begin").style.visibility="hidden";
    
    // Bring scene back into frame
    document.getElementById("scene").style.left = "1000px";
    var sound1 = document.querySelector('#oceanSound');
    var sound2 = document.querySelector('#buoySound');
//    var sound3 = document.querySelector('#gullSound');
    var sound4 = document.querySelector('#gullSounds');
    sound1.components.sound.playSound();
    sound2.components.sound.playSound();
//    sound3.components.sound.playSound();
    sound4.components.sound.playSound();
    
}

/*************************************************/            
            // Give permission to use Motoin & Orientation
/*window.onload = function(){
    if(typeof DeviceMotionEvent.requestPermission === 'function'){
        DeviceMotionEvent.requestPermission()
        .then(response => {
          if (response == 'granted') {
            window.addEventListener('devicemotion', (e) => {
              // do something with e - not necessary
            })
          }
        })
        .catch(console.error)
    }
    if(typeof DeviceOrientationEvent.requestPermission === 'function'){
        DeviceOrientationEvent.requestPermission()
        .then(response => {
          if (response == 'granted') {
            window.addEventListener('deviceorientation', (e) => {
              // do something with e - not necessary
            })
          }
        })
        .catch(console.error)
    }
}*/
            
/*************************************************/

function hidePlay() {
    document.getElementById("begin").style.display = "none";
    
    /*************************************************/            
            // Give permission to use Motoin & Orientation
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
        };
    
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
        };    
};

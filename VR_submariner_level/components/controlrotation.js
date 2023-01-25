/* *********************************************************** */
/* Component to use the HMD controller joystick to turn around */
/* *********************************************************** */
AFRAME.registerComponent('controlrotation', {
    init: function(){
        let el = this.el;// controller
        let player = document.getElementById("cameraRig");
        el.addEventListener('axismove', function(evt){
            if(evt.detail.axis[2]>0.5){
                player.object3D.rotation.y-=0.05;
            }else if(evt.detail.axis[2]<-0.5){
                player.object3D.rotation.y+=0.05;
            };
            
            if(evt.detail.axis[3]>0.5){
                // console.log("move back");
            }else if(evt.detail.axis[3]<-0.5){
                // console.log("move forward");
            };
        });
    }
});
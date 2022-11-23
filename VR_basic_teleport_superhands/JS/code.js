AFRAME.registerComponent('contact-listener', {
    init: function () {
        var message = "Now it's ";
        let object = this.el.id;
        let color = '#9300ff';
        
        console.log("hello world", object);
        
        this.el.addEventListener('over', function(evt){
            document.getElementById("text").setAttribute("value", message+object);
            this.setAttribute('material', 'color', color);
        });
        
//        this.el.addEventListener('click', function (evt) {
//            lastIndex = (lastIndex + 1) % COLORS.length;
//            this.setAttribute('material', 'color', COLORS[lastIndex]);
//            console.log('I was clicked at: ', evt.detail.intersection.point);
//            document.getElementById("text").setAttribute("value", message+COLORS[lastIndex]);
//        });
    }
});

AFRAME.registerComponent('grabbed', {
    schema:{
        feedbackTXT:{type:'selector', default:'#feedback'},
    },
    init: function(){
        let data = this.data;
        console.log("feedback:", data.feedbackTXT);
        const SET_COMP_PROPS = AFRAME.utils.entity.setComponentProperty;
        SET_COMP_PROPS(data.feedbackTXT, 'value', "Listening...");

    },
    play: function() {
        let data = this.data;
        this.el.addEventListener('grab-start', function(evt) {
            console.log("Grab Start");
            const SET_COMP_PROPS = AFRAME.utils.entity.setComponentProperty;
            SET_COMP_PROPS(data.feedbackTXT, 'value', "Submariner...");
        });
        this.el.addEventListener('grab-end', function(evt) {
            console.log("Grab Stop");
            const SET_COMP_PROPS = AFRAME.utils.entity.setComponentProperty;
            SET_COMP_PROPS(data.feedbackTXT, 'value', "Submariner Walkabout");

            /* evt.detail.dropped.setAttribute('material', 'color',
            '#'+(Math.random()*0xFFFFFF<<0).toString(16))
            // notify super-hands that the gesture was accepted
            evt.preventDefault() */
        });
    }
  })

AFRAME.registerComponent('controllisten', {
    init: function(){
        let el = this.el;// controller
        let id = el.id;
        let player = document.getElementById("cameraRig");
        console.log("player is",player);
        console.log("testing", el);
        console.log("test2", id);
        console.log('next: thumbstick activation!');
        el.addEventListener('axismove', function(evt){
            console.log('thumb stick moved');
            //test code for thumbstick courtesy SirFizX & Pavel
            if(evt.detail.axis[2]>0.5){
                console.log("rotate view to the right");
                player.object3D.rotation.y-=0.05;
            }else if(evt.detail.axis[2]<-0.5){
                console.log("rotate view to the left");
                player.object3D.rotation.y+=0.05;
            };
            
            if(evt.detail.axis[3]>0.5){
                console.log("move back");
            }else if(evt.detail.axis[3]<-0.5){
                console.log("move forward");
            };
        });
    }
});

//Example code for implementing the thumbstick to rotate the camera
// found on A-frame Slack - credit SirFizX

//CS1.MyPlayer.Lh.addEventListener('axismove', e => {
//    if (CS1.Cam.isSweeping) return;
//
//    if (CS1.Rig && CS1.Rig.rotateInSteps) {
//        if ((e.detail.axis[2] > .5) && !CS1.Rig.isRotating) {
//            CS1.Rig.object3D.rotateY(-CS1.Rig.rotateStep)
//            CS1.MyPlayer.object3D.rotateY(-CS1.Rig.rotateStep)
//            CS1.Rig.isRotating = true
//            setTimeout(e => {
//                CS1.Rig.isRotating = false
//            }, 1000)
//        } else if ((e.detail.axis[2] < -.5) && !CS1.Rig.isRotating) {
//            CS1.Rig.object3D.rotateY(CS1.Rig.rotateStep)
//            CS1.MyPlayer.object3D.rotateY(CS1.Rig.rotateStep)
//            CS1.Rig.isRotating = true
//            setTimeout(e => {
//                CS1.Rig.isRotating = false
//            }, 1000)
//        }
//    } else {
//        if (e.detail.axis[2] > .5) {
//            CS1.Rig.object3D.rotateY(-CS1.MyPlayer.rotSpeed)
//            CS1.MyPlayer.object3D.rotateY(-CS1.MyPlayer.rotSpeed)
//        } else if (e.detail.axis[2] < -.5) {
//            CS1.Rig.object3D.rotateY(CS1.MyPlayer.rotSpeed)
//            CS1.MyPlayer.object3D.rotateY(CS1.MyPlayer.rotSpeed)
//        }
//    }
//    
//    if (e.detail.axis[3] > .5) {
//        CS1.MyPlayer.object3D.translateZ(CS1.MyPlayer.speed)
//    } else if (e.detail.axis[3] < -.5) {
//        CS1.MyPlayer.object3D.translateZ(-CS1.MyPlayer.speed)
//    }
//    
//})
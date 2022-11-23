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
AFRAME.registerComponent('pointer', {
    // built-in method
    init:function(){
        // grab scope
        const el = this.el;
        
        // On Click
        el.addEventListener('click', (evt) => {

            // grab clicked target info
            let target = evt.detail.intersection;
            console.log(evt.detail);
            console.log("target", target);
            console.log("Inside object.el call", target.object.el);// we're inside the a-entity element
            // target.object.el.setAttribute('visible', false);// this works
            const SET_COMP_PROPS = AFRAME.utils.entity.setComponentProperty;
            // SET_COMP_PROPS(target.object.el, 'opacity', 0.25);// this works
            SET_COMP_PROPS(target.object.el, 'color', '#'+(Math.random()*0xFFFFFF<<0).toString(16));// this works

            // UI panels
            // let uiCheck = target.object.el.parentEl;

            // Call Scene Manager Component
            /* let sceneManager = document.querySelector('#scene').components.scenemgr;
            console.log("scene mgr", sceneManager); */

            /* if (uiCheck.id === "uiGroup") {
                sceneManager.uiMethod(target, uiCheck);
            } else {
                sceneManager.collectorMethod(target);
            }; */

        });
        // When hovering on a clickable item, change the cursor colour.
        el.addEventListener('mouseenter', ()=>{
            el.setAttribute('material', {color: '#00ff00'});
        });
        el.addEventListener('mouseleave', ()=>{
           el.setAttribute('material', {color: '#ffffff'}); 
        });
    }
});

AFRAME.registerComponent('grabbingtest', {
    schema:{
        feedbackTXT:{type:'selector', default:'#feedback'}
    },
    init: function(){
        let data = this.data;
        let message = "Version: 1.0.8";
        const SET_COMP_PROPS = AFRAME.utils.entity.setComponentProperty;
        SET_COMP_PROPS(data.feedbackTXT, 'value', "Listening...");
        document.getElementById("text").innerHTML= message;
    },
    play: function() {
        let data = this.data;
        let el = this.el;
        el.addEventListener('grab-start', function(evt) {
            console.log(evt);
            const SET_COMP_PROPS = AFRAME.utils.entity.setComponentProperty;
            SET_COMP_PROPS(data.feedbackTXT, 'value', evt.detail.hand.id);
            // SET_COMP_PROPS(data.feedbackTXT, 'value', "Submariner...");
        });
        el.addEventListener('grab-end', function(evt) {
            console.log(evt);
            const SET_COMP_PROPS = AFRAME.utils.entity.setComponentProperty;
            SET_COMP_PROPS(data.feedbackTXT, 'value', evt.detail.target.id);
            // SET_COMP_PROPS(data.feedbackTXT, 'value', "Submariner Walkabout");
            console.log("Components:", evt.detail.target.components);

            SET_COMP_PROPS(evt.detail.target.object.el, 'color', '#'+(Math.random()*0xFFFFFF<<0).toString(16));// not working
            // SET_COMP_PROPS(evt.detail.target.components.material, 'color', '#'+(Math.random()*0xFFFFFF<<0).toString(16));// not working

            evt.preventDefault();
        });
    }
  })

AFRAME.registerComponent('controllisten', {
    init: function(){
        let el = this.el;// controller
        let id = el.id;
        let player = document.getElementById("cameraRig");
        console.log("player is",player);
        console.log("Who is calling:", id);
        el.addEventListener('axismove', function(evt){
            // console.log('thumb stick moved');
            // test code for thumbstick courtesy SirFizX & Pavel
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
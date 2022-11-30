/* Working version 1.2.* */
/* Includes teleport, grab, collect and with device detection */
/* Version 1.2.1 includes working desktop and mobile additions */

AFRAME.registerComponent('scenemgr', {
    schema:{
        feedbackTXT:{type:'selector', default:'#feedback'},
        cursor:{type:'selector', default:'a-cursor'},

        activeCamRig:{type:'selector', default:'#cameraRig'},
        activeCam:{type:'selector', default:"#camera"},
        // cineCam:{type:'selector', default:"#cinematic"},
    },

    init: function(){
        let el = this.el;
        let data = this.data;
        const SET_COMP_PROPS = AFRAME.utils.entity.setComponentProperty;

        let message = "Version: 1.2.1.2";
        document.getElementById("text").innerHTML= message;

        message = "listening...";

        el.addEventListener('enter-vr', evt=>{
            // console.log("Device check:", AFRAME.utils.device);

            if(AFRAME.utils.device.checkHeadsetConnected() === true){
                message = "Cursor has been hidden";
                SET_COMP_PROPS(data.cursor , 'visible', false);// this works
                SET_COMP_PROPS(data.activeCamRig, 'movement-controls.enabled', false);
            }else{
                message = "It's Desktop or Mobile";
                SET_COMP_PROPS(data.activeCamRig, 'movement-controls.enabled', true);
            };

        });
        
        el.addEventListener('exit-vr', evt=>{
            message = "Cursor visible";
            SET_COMP_PROPS(data.cursor , 'visible', true);// this works
        });

        SET_COMP_PROPS(data.feedbackTXT, 'value', message);
        console.log(THREE.Cache);
    },

    collectorMgmt: function(forCollection){
        console.log("Hello from collectorMgmt:", forCollection);
        let data = this.data;
        let message = forCollection.id;
        const SET_COMP_PROPS = AFRAME.utils.entity.setComponentProperty;
        SET_COMP_PROPS(data.feedbackTXT, 'value', message);
        SET_COMP_PROPS(forCollection.object3D.el, 'class', 'not-clickable');//Working
        SET_COMP_PROPS(forCollection.object3D.el, 'visible', false);// this works
    }
});

/* ******************************************************** */
/* Component to listen for mouse click on entity - desktop  */
/* ******************************************************** */
AFRAME.registerComponent('pointer', {
    // built-in methods
    schema:{
        sceneLocator:{type:'selector', default:'a-scene'},
    },

    init:function(){
    },
    
    play:function(){
        const el = this.el;// grab scope
        let data = this.data;// grab schema data
        
        // On click event
        el.addEventListener('click', (evt) => {
            // grab clicked target info
            let target = evt.detail.intersectedEl;
            let sceneManager = data.sceneLocator.components.scenemgr;
            sceneManager.collectorMgmt(target);// this works
        });

        // When hovering on a clickable item, change the cursor colour.
        el.addEventListener('mouseenter', (evt)=>{
            el.setAttribute('material', {color: '#00ff00'});
            let target = evt.detail.intersectedEl;
            if(!target.components.animation__pos){
                console.log("No animations");
            }else{
                target.components.animation__pos.animation.pause();
                target.components.animation__rot.animation.pause();
            }
            
        });
        el.addEventListener('mouseleave', (evt)=>{
           el.setAttribute('material', {color: '#ffffff'});
           let target = evt.detail.intersectedEl;
            if(!target.components.animation__pos){
                console.log("No animations");
            }else{
                target.components.animation__pos.animation.play();
                target.components.animation__rot.animation.play();
            } 
        });
    }
});

/* *********************************************************** */
/* Component to listen for HMD controllers grabbing an entity  */
/* *********************************************************** */
AFRAME.registerComponent('grabbingtest', {
    schema:{
        sceneLocator:{type:'selector', default:'a-scene'},
        feedbackTXT:{type:'selector', default:'#feedback'}
    },
    init: function(){
        console.log("init: Grabbing test");
    },

    play: function() {
        console.log("play: Grabbing test");
        let data = this.data;
        let el = this.el;
        const SET_COMP_PROPS = AFRAME.utils.entity.setComponentProperty;// correct method to change attributes
        let sceneManager = data.sceneLocator.components.scenemgr;

        el.addEventListener('hover-start', function(evt) {
            let target = evt.detail.target;
            // const SET_COMP_PROPS = AFRAME.utils.entity.setComponentProperty;// correct method to change attributes
            SET_COMP_PROPS(data.feedbackTXT, 'value', evt.detail.hand.id);
            target.components.animation__pos.animation.pause();
            target.components.animation__rot.animation.pause();
            console.log("Target evt:", target);
        });

        el.addEventListener('hover-end', function(evt) {
            let target = evt.detail.target;
            // const SET_COMP_PROPS = AFRAME.utils.entity.setComponentProperty;// correct method to change attributes
            SET_COMP_PROPS(data.feedbackTXT, 'value', evt.detail.hand.id);
            target.components.animation__pos.animation.play();
            target.components.animation__rot.animation.play();
            console.log("Target evt:", target);
        });

        el.addEventListener('grab-start', function(evt) {
            let target = evt.detail.target;
            // const SET_COMP_PROPS = AFRAME.utils.entity.setComponentProperty;// correct method to change attributes
            SET_COMP_PROPS(data.feedbackTXT, 'value', evt.detail.hand.id);
            target.components.animation__pos.animation.pause();
            target.components.animation__rot.animation.pause();
            console.log("Target evt:", target);
        });

        el.addEventListener('grab-end', function(evt) {
            // const SET_COMP_PROPS = AFRAME.utils.entity.setComponentProperty;
            SET_COMP_PROPS(data.feedbackTXT, 'value', evt.detail.target.id);

            // SET_COMP_PROPS(evt.detail.target.object3D.el, 'color', '#'+(Math.random()*0xFFFFFF<<0).toString(16));// Works!
            sceneManager.collectorMgmt(evt.detail.target);// Works - it calls scene manager and the method with the target

            evt.preventDefault();// not sure what this does yet
        });
    }
  })

/* *********************************************************** */
/* Component to use the HMD controller joystick to turn around */
/* *********************************************************** */
AFRAME.registerComponent('controllisten', {
    init: function(){
        let el = this.el;// controller
        // let id = el.id;
        let player = document.getElementById("cameraRig");
        // console.log("player is",player);
        // console.log("Who is calling:", id);
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

/* *********************************************************** */
/*   Component to start play animations on an entity object    */
/* *********************************************************** */
AFRAME.registerComponent('animstart', {
    init: function(){
        let el = this.el;
        console.log("Animation Component:", el.components);
        el.components.animation__pos.animation.play();
        el.components.animation__rot.animation.play();
    }
});
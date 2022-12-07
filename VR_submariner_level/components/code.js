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

        // Track changes in upper left corner
        let message = "Version: 1.2.2.2";
        document.getElementById("text").innerHTML= message;

        // Change message for tracking in VR
        message = "listening...";

        el.addEventListener('enter-vr', evt=>{
            console.log("entering VR mode");
            // console.log("Device check:", AFRAME.utils.device);
            // We want to check to see if we're on desktop/mobile or a Head Mounted Display
            // if it is a HMD then hide the cursor and disable movement-controls
            // We're using the joystick in this iteration to teleport so we don't want the
            // move-controls active.
            // movement-controls will allow us to use the 'gamepad' aspect to allow
            // the player to move about using the joystick for forward/backwards & strafe left/right

            if(AFRAME.utils.device.checkHeadsetConnected() === true){
                message = "Cursor has been hidden";
                SET_COMP_PROPS(data.cursor , 'visible', false);// this works
                // SET_COMP_PROPS(data.cursor , 'raycaster.enabled', false);// does this works?
                SET_COMP_PROPS(data.activeCamRig, 'movement-controls.enabled', false);
            }else{
                message = "It's Desktop or Mobile";
                SET_COMP_PROPS(data.activeCamRig, 'movement-controls.enabled', true);
            };

            SET_COMP_PROPS(data.feedbackTXT, 'value', message);
        });
        
        el.addEventListener('exit-vr', evt=>{
            message = "Cursor visible";
            SET_COMP_PROPS(data.cursor , 'visible', true);// this works
        });
        
        SET_COMP_PROPS(data.feedbackTXT, 'value', message);
        // console.log("what is in the cache:",THREE.Cache);
    },

    collectorMgmt: function(forCollection){
        // console.log("Hello from collectorMgmt:", forCollection);
        // console.log("Parent of target is:", forCollection.parentEl.id);
        let el = this.el;
        let data = this.data;
        let message = forCollection.id;
        const GET_COMP_PROPS = AFRAME.utils.entity.getComponentProperty;// GET
        const SET_COMP_PROPS = AFRAME.utils.entity.setComponentProperty;// SET

        let camPosition = GET_COMP_PROPS(data.activeCam.object3D.el, 'position');
        let camRigPosition = GET_COMP_PROPS(data.activeCamRig.object3D.el, 'position');
        // console.log("Camera position:", camRigPosition.x+", "+camPosition.y+", "+camRigPosition.z);
        
        SET_COMP_PROPS(forCollection.parentEl.object3D.el, 'animation__collpos', 'to:'+(camRigPosition.x+camPosition.x)+" "+camPosition.y+" "+(camRigPosition.z+camPosition.z));
        SET_COMP_PROPS(data.feedbackTXT, 'value', message);
        SET_COMP_PROPS(forCollection.object3D.el, 'class', 'not-clickable');//Working

        forCollection.parentEl.components.animation__collpos.animation.play();
        forCollection.parentEl.components.animation__collscale.animation.play();

        // Check to see if the triggered animation(s) have completed
        let animFinish = forCollection.parentEl.object3D.el;
        animFinish.addEventListener('animationcomplete__collpos', (evt)=>{
            console.log("Animation complete", evt);
            SET_COMP_PROPS(forCollection.object3D.el, 'visible', false);// this works
        });

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
            // we will want to target the parent which is the coin container
            // so that we can trigger an animation for collection
            // that is: parentEl
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
        // console.log("init: Grabbing test");
    },

    play: function() {
        // console.log("play: Grabbing test");
        let data = this.data;
        let el = this.el;
        const SET_COMP_PROPS = AFRAME.utils.entity.setComponentProperty;// correct method to change attributes
        let sceneManager = data.sceneLocator.components.scenemgr;

        el.addEventListener('hover-start', function(evt) {
            console.log("Hover Start Event")
            let target = evt.detail.target;
            // const SET_COMP_PROPS = AFRAME.utils.entity.setComponentProperty;// correct method to change attributes
            SET_COMP_PROPS(data.feedbackTXT, 'value', evt.detail.hand.id);
            target.components.animation__pos.animation.pause();
            target.components.animation__rot.animation.pause();
            console.log("Target evt:", target);
        });

        el.addEventListener('hover-end', function(evt) {
            console.log("Hover End Event")
            let target = evt.detail.target;
            // const SET_COMP_PROPS = AFRAME.utils.entity.setComponentProperty;// correct method to change attributes
            SET_COMP_PROPS(data.feedbackTXT, 'value', evt.detail.hand.id);
            target.components.animation__pos.animation.play();
            target.components.animation__rot.animation.play();
            console.log("Target evt:", target);
        });

        el.addEventListener('grab-start', function(evt) {
            console.log("Grab Start Event")
            let target = evt.detail.target;
            // const SET_COMP_PROPS = AFRAME.utils.entity.setComponentProperty;// correct method to change attributes
            SET_COMP_PROPS(data.feedbackTXT, 'value', evt.detail.hand.id);
            target.components.animation__pos.animation.pause();
            target.components.animation__rot.animation.pause();
            console.log("Target evt:", target);
        });

        el.addEventListener('grab-end', function(evt) {
            console.log("Grab End Event")
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
        // console.log("Animation Component:", el.components);
        el.components.animation__pos.animation.play();
        el.components.animation__rot.animation.play();
    }
});
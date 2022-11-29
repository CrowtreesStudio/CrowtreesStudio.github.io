/* Working version 1.2.1 */
/* Includes teleport, grab, collect, device detection and mobile navigation */
/* Adding UI elements and game state changes (gameplay) */

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

        let message = "Version: 1.2.2";
        document.getElementById("text").innerHTML= message;

        message = "listening...";

        el.addEventListener('enter-vr', evt=>{
            // console.log("Device check:", AFRAME.utils.device);

            if(AFRAME.utils.device.checkHeadsetConnected() === true){
                message = "Cursor has been hidden";
                SET_COMP_PROPS(data.cursor , 'visible', false);// this works
                SET_COMP_PROPS(data.activeCam, 'movement-controls.enabled', false);
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
        el.addEventListener('mouseenter', ()=>{
            el.setAttribute('material', {color: '#00ff00'});
        });
        el.addEventListener('mouseleave', ()=>{
           el.setAttribute('material', {color: '#ffffff'}); 
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
    },

    play: function() {
        console.log("Grabbing test");
        // Place grabbingtest on the RIGHT & LEFT HANDS and not on the objects as was the previous version
        // The objects should yield thier id based on what the Sphere Collider returns
        let data = this.data;
        let el = this.el;
        let sceneManager = data.sceneLocator.components.scenemgr;

        el.addEventListener('grab-start', function(evt) {
            const SET_COMP_PROPS = AFRAME.utils.entity.setComponentProperty;// correct method to change attributes
            SET_COMP_PROPS(data.feedbackTXT, 'value', evt.detail.hand.id);
            console.log(evt.detail);
        });

        el.addEventListener('grab-end', function(evt) {
            const SET_COMP_PROPS = AFRAME.utils.entity.setComponentProperty;
            SET_COMP_PROPS(data.feedbackTXT, 'value', evt.detail.target.id);

            // SET_COMP_PROPS(evt.detail.target.object3D.el, 'color', '#'+(Math.random()*0xFFFFFF<<0).toString(16));// Works!
            sceneManager.collectorMgmt(evt.detail.target);// Works - it calls scene manager and the method with the target

            evt.preventDefault();// not sure what this does yet
            console.log(evt.detail);
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
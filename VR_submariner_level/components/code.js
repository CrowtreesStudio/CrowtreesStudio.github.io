/* Based on working version 1.2.* of VR_basic_teleport_collect */
/* Includes teleport, grab, collect and with device detection */
/* Version 1.2.1 includes working desktop and mobile additions */

/* ****************************************************************************** */
/*   Scene Manager component that manages game logic & takes calls from events    */
/* ****************************************************************************** */
AFRAME.registerComponent('scenemgr', {
    schema:{
        hudCopy:{type:'selector', default:'#feedback'},
        uiGroup:{type:'selector', default:'#uiGroup'},
        uiTitle:{type:'selector', default:'#uiTitle'},
        uiCopy:{type:'selector', default:'#uiCopy'},
        
        beginScrn:{type:'selector', default:'#begin'},
        cursor:{type:'selector', default:'a-cursor'},
        rtHand:{type:'selector', default:'#leftHand'},
        ltHand:{type:'selector', default:'#rightHand'},
        fuelGem:{type:'selector', default:'#fuelGem'},
        submarine:{type:'selector', default:'#submarine'},

        activeCamRig:{type:'selector', default:'#cameraRig'},
        activeCam:{type:'selector', default:"#camera"},
        cineCam:{type:'selector', default:"#cinematic"},
        takeScreenShot:{type:'boolean', default:false},
        scrnShotCam:{type:'selector', default:"#scrnShotCam"},

        coinsNeeded:{type:'number', default:4},
        coinsCollected:{type:'number', default:0},
        fuelGemCollected:{type:'boolean', default:false},

        sound1:{type:'selector', default:'#oceanWaves'},
        sound2:{type:'selector', default:'#gemSnd'},
        sound3:{type:'selector', default:'#itemPickup'},
        sound4:{type:'selector', default:'#subEngine'},
        soundFirefox:{type:'selectorAll', default:'audio'}

    },

    init: function(){
        let el = this.el;
        let data = this.data;
        const SET_COMP_PROPS = AFRAME.utils.entity.setComponentProperty;

        //screenshots
        if(data.takeScreenShot){
            console.log("take screenshot", data.takeScreenShot);
            SET_COMP_PROPS(data.activeCam, 'visible', false);
            SET_COMP_PROPS(data.activeCam, 'active', false);
            SET_COMP_PROPS(data.cineCam, 'visible', false);
            SET_COMP_PROPS(data.cineCam, 'active', false);
            SET_COMP_PROPS(data.scrnShotCam, 'visible', true);
            SET_COMP_PROPS(data.scrnShotCam, 'active', true);
            SET_COMP_PROPS(data.uiGroup, 'visible', false);
        }else{
            // Make sure main camera is active
            SET_COMP_PROPS(data.activeCam, 'active', true);
            // Make sure the cinematic camera is off
            SET_COMP_PROPS(data.cineCam, 'active', false);
            // Screenshot Camera off
            // SET_COMP_PROPS(data.scrnShotCam, 'active', false);
            // Prevent movement until menu panel button clicked
            SET_COMP_PROPS(data.activeCamRig, 'movement-controls.enabled', false);
        }

        console.log("cameras:", data.activeCam, data.cineCam, data.scrnShotCam);

        // Hud feedback
        SET_COMP_PROPS(data.hudCopy, 'visible', false);

        // UI Panel display
        SET_COMP_PROPS(data.uiTitle, 'value', 'Submariner Walkabout');
        SET_COMP_PROPS(data.uiCopy, 'value', '\nYour task is an easy one.\nCollect all the blue coins to reveal the Fuel Gem.\nReturn to your submarine with the Fuel Gem to power your engine and end the game.\nGood luck!"');


        // Track changes in upper left corner
        let message = "Version: 1.4.2";
        document.getElementById("text").innerHTML= message;

        // Change message for tracking in VR
        // message = "Collect "+data.coinsNeeded+" coins";

        // Hide VR ui button if not a mobile device
        window.addEventListener('load', evt=>{
            // I'm leaving these here as a useful exploration
            console.log("Device check:", AFRAME.utils.device);
            console.log("WebXR enabled?:", AFRAME.utils.device.isWebXRAvailable);
            console.log("Is it a Browser?:", AFRAME.utils.device.isBrowserEnvironment);
            console.log("Is it a VR Display?:", AFRAME.utils.device.getVRDisplay());
            console.log("Is it iOS?:", AFRAME.utils.device.isIOS());
            console.log("Is it a HMD connected?:", AFRAME.utils.device.checkHeadsetConnected());
            if(!!AFRAME.utils.device.isIOS){
                SET_COMP_PROPS(el, 'vr-mode-ui.enabled', false);
            }
        });

        el.addEventListener('teleported', function (e) {
            console.log(e.detail.oldPosition, e.detail.newPosition, e.detail.hitPoint,"Contents of Detail:", e.detail);
        });

        el.addEventListener('enter-vr', evt=>{
            console.log("entering VR mode");
            console.log("Device check:", AFRAME.utils.device);
            // We want to check to see if we're on desktop/mobile or a Head Mounted Display
            // if it is a HMD then hide the cursor and disable movement-controls
            // We're using the joystick in this iteration to teleport so we don't want the
            // move-controls active.
            // movement-controls will allow us to use the 'gamepad' aspect to allow
            // the player to move about using the joystick for forward/backwards & strafe left/right

            if(AFRAME.utils.device.checkHeadsetConnected() === true){
                message = "Welcome to the Submariner Walkabout";
                SET_COMP_PROPS(data.cursor , 'visible', false);// this works
                SET_COMP_PROPS(data.cursor , 'raycaster.enabled', false);// this works
                SET_COMP_PROPS(data.ltHand , 'raycaster.enabled', false);
                SET_COMP_PROPS(data.rtHand , 'raycaster.enabled', false);
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
        
        SET_COMP_PROPS(data.hudCopy, 'value', message);
        // console.log("what is in the cache:",THREE.Cache);
    },


    startExperience: function(){
        console.log("startExperience");
        let data = this.data;
        data.beginScrn.style.display = 'none';
//        data.dialHud.style.display = 'block';
        if(data.browserCheck){
                data.soundFirefox[0].loop=true;// for firefox
                data.soundFirefox[0].volume=0.1;// for firefox
                data.soundFirefox[0].play();// for firefox
            }else{
                data.sound1.components.sound.playSound();
                console.log("sound:", data.sound1);
            }
    },

    // UI Panels
    // HUD & feedback
    uiMethod: function(){
        let data = this.data;
        // data.sound3.components.sound.playSound();

        const SET_COMP_PROPS = AFRAME.utils.entity.setComponentProperty;
        SET_COMP_PROPS(data.hudCopy, 'opacity', 1.0);        

        data.hudCopy.components.animation.animation.reset();
        data.hudCopy.components.animation__fade.animation.reset();
        

        this.delayAnim(data.hudCopy.components.animation.animation,1000);
        this.delayAnim(data.hudCopy.components.animation__fade.animation, 1000);
    },
    
    delayAnim: function(target, delay){
        console.log("delayAnim");
        setTimeout(function(){target.play()}, delay);
    },

    /*****************************************/
    /*         Collection Management        */
    /*****************************************/
    collectorMgmt: function(selectedObj){
        let data = this.data;

        // const GET_COMP_PROPS = AFRAME.utils.entity.getComponentProperty;// GET
        const SET_COMP_PROPS = AFRAME.utils.entity.setComponentProperty;// SET

        let position = new THREE.Vector3();
        console.log("World position of camera:", data.activeCam.object3D.getWorldPosition(position));
        let camPosition = data.activeCam.object3D.getWorldPosition(position);      
        SET_COMP_PROPS(selectedObj.parentEl.object3D.el, 'animation__collpos', 'to:'+camPosition.x+" "+(camPosition.y-0.1)+" "+camPosition.z);

        // Check to see if the triggered animation(s) have completed
        // This is used by both the Coins and Gem
        // is there a better place to put it?
        let animFinish = selectedObj.parentEl.object3D.el;
        animFinish.addEventListener('animationcomplete__collscale', ()=>{
            SET_COMP_PROPS(selectedObj.object3D.el, 'visible', false);// this works
        });

        /* Check which object has been seleceted */
        let itemClicked = selectedObj.id.substr(0,4);
        if(itemClicked === 'coin' && data.coinsCollected < data.coinsNeeded){
            /* A Coin has been selected and will be added to the total number of Coins collected */
            data.coinsCollected++;
            if(data.coinsCollected<=1){
                message = "You have 1 coin";
            }else{
                message = "You have "+data.coinsCollected.toString()+" coins";
            };
            message += " of "+data.coinsNeeded+" collected";

            this.uiMethod(data.hudCopy);
            
            SET_COMP_PROPS(selectedObj.object3D.el, 'class', 'not-clickable not-grabbable');//Fuel Gem now not selectable
            
            selectedObj.parentEl.components.animation__collpos.animation.play();
            selectedObj.parentEl.components.animation__collscale.animation.play();
            data.sound3.components.sound.playSound();
            
        }else if(itemClicked === 'fuel' && data.coinsCollected >= data.coinsNeeded){
            /* The Fuel Gem has been collected and now the Submarine can be selected */
            data.fuelGemCollected = true;
            selectedObj.parentEl.components.animation__collpos.animation.play();
            selectedObj.parentEl.components.animation__collscale.animation.play();
            data.sound3.components.sound.playSound();
            console.log("dim light:", selectedObj.parentEl.children[1]);
            selectedObj.parentEl.children[1].components.animation__colllight.animation.play();// turn off light
            SET_COMP_PROPS(selectedObj.object3D.el, 'class', 'not-clickable not-grabbable');//Fuel Gem now not selectable
            SET_COMP_PROPS(data.submarine, 'class', 'clickable');//Submarine is selectable
            SET_COMP_PROPS(data.cursor, 'raycaster.far', 2.0);
            SET_COMP_PROPS(data.ltHand , 'raycaster.enabled', true);
            SET_COMP_PROPS(data.rtHand , 'raycaster.enabled', true);
            SET_COMP_PROPS(data.ltHand , 'raycaster.far', 2.0);
            SET_COMP_PROPS(data.rtHand , 'raycaster.far', 2.0);
            message="Well Done! Return to the Submarine";
            this.uiMethod(data.hudCopy);
        }else if(itemClicked === 'subm'){
            /* The Submarine has been selected and the game ends */
            SET_COMP_PROPS(data.activeCam, 'visible', false);
            SET_COMP_PROPS(data.activeCam, 'active', false);
            SET_COMP_PROPS(data.cineCam, 'visible', true);
            SET_COMP_PROPS(data.cineCam, 'active', true);
            SET_COMP_PROPS(data.ltHand, 'visible', false);
            SET_COMP_PROPS(data.rtHand, 'visible', false);
            SET_COMP_PROPS(data.submarine, 'animation-mixer.clip', 'prop_rotation');
            selectedObj.parentEl.components.animation.animation.play();
            data.sound4.components.sound.playSound();
            message="Get outta 'ere!";
        }else if(itemClicked === 'butt'){
            data.sound3.components.sound.playSound();
            SET_COMP_PROPS(data.hudCopy, 'visible', true);
            SET_COMP_PROPS(data.uiGroup, 'visible', false);
            SET_COMP_PROPS(data.cursor, 'class', 'not-clickable');//Submarine is selectable
            SET_COMP_PROPS(data.cursor, 'raycaster.far', 0.3);
            SET_COMP_PROPS(data.activeCamRig, 'movement-controls.enabled', true);
            message = "Collect "+data.coinsNeeded+" coins";
            this.uiMethod(data.hudCopy);
        };
        
        // Animate the Fuel Gem and make it clickable
        if(data.coinsCollected >= data.coinsNeeded && !data.fuelGemCollected){
            SET_COMP_PROPS(data.fuelGem.object3D.el, 'visible', true);// Make Fuel Gem visible
            SET_COMP_PROPS(data.fuelGem.children[0], 'class', 'clickable');//Make Fuel Gem Clickable
            data.fuelGem.children[0].components.animation__pos.animation.play();// Fuel Gem mesh
            data.fuelGem.children[1].components.animation__pos.animation.play();// Animate Point Light
            data.sound2.components.sound.playSound();
        };
        
        SET_COMP_PROPS(data.hudCopy, 'value', message);// display message on main screen for player feedback

    }
});

/* ************************************************************************************ */
/* *********************************************************** */
/* *********************************************************** */
/*   Components that set-up initial game state & conditions    */
/* *********************************************************** */
/* *********************************************************** */
/* ************************************************************** */
/*   Component to start playing animations on an entity object    */
/* ************************************************************** */
AFRAME.registerComponent('animstart', {
    init: function(){
        let el = this.el;
        // console.log("Animation Component:", el.components);
        el.components.animation__pos.animation.play();
        el.components.animation__rot.animation.play();
    }
});

/* ********************************************************************** */
/*   Component to parse mesh objects and apply shadows: receive & cast    */
/* ********************************************************************** */
AFRAME.registerComponent('mesh-shadows', {
    // built-in method
    update:function(){
        this.el.addEventListener('model-loaded', ()=>{
            // console.log("mesh check model loaded");
            const el = this.el;
            console.log("el to show object", el.getObject3D('mesh'));
            const obj = this.el.getObject3D('mesh');
            obj.children.forEach((model)=>{
                //model.receiveShadow=true;
                if(model.name === 'ground'){
                    model.castShadow=false;
                    model.receiveShadow=true;
                }else if(model.name != 'coin'){
                    model.castShadow=true;
                    model.receiveShadow=true;
                    model.material.shadowSide=1;
                }else{
                    model.castShadow=true;
                    model.material.shadowSide=1;
                }
            });
        });
    }
});

/* ******************************************************* */
/*          Component that reads camera rotation           */
/* ******************************************************* */
AFRAME.registerComponent('rotation-reader', {
    tick: function () {
      // `this.el` is the element.
      // `object3D` is the three.js object.
  
      // `rotation` is a three.js Euler using radians. `quaternion` also available.
      //   console.log(this.el.object3D.quaternion);
      console.log(this.el.object3D.rotation);
  
      // `position` is a three.js Vector3.
      console.log(this.el.object3D.position);
    }
    // <a-entity camera look-controls rotation-reader>
  });

/* ************************************************************************************ */
/* ********************************************************** */
/*   Components that provide player with game interactions    */
/* ********************************************************** */
/* ********************************************************** */
/* ******************************************************** */
/* Component to listen for mouse click on entity - desktop  */
/* ******************************************************** */
AFRAME.registerComponent('cursor-selector', {
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
            console.log("Click event", target);
            let sceneManager = data.sceneLocator.components.scenemgr;
            sceneManager.collectorMgmt(target);// Call collectorMgmt method in scenemgr
        });

        // When hovering on a clickable item, change the cursor colour.
        // Pause object animations
        el.addEventListener('mouseenter', (evt)=>{
            el.setAttribute('material', {color: '#00ff00'});
            let target = evt.detail.intersectedEl;
            if(!target.components.animation__pos){
                console.log("No animations");
            }else{
                target.components.animation__pos.animation.pause();
                target.parentEl.children[1].components.animation__pos.animation.pause()
                target.components.animation__rot.animation.pause();
            }
            
        });
        // Hover off return colour to normal
        // Resume object's animations
        el.addEventListener('mouseleave', (evt)=>{
           el.setAttribute('material', {color: '#ffffff'});
           let target = evt.detail.intersectedEl;
            if(!target.components.animation__pos){
                console.log("No animations");
            }else{
                target.components.animation__pos.animation.play();
                target.parentEl.children[1].components.animation__pos.animation.play()
                target.components.animation__rot.animation.play();
            } 
        });
    }
});

/* *********************************************************** */
/* Component to listen for HMD controllers grabbing an entity  */
/* *********************************************************** */
AFRAME.registerComponent('grabbing', {
    schema:{
        sceneLocator:{type:'selector', default:'a-scene'},
        hudCopy:{type:'selector', default:'#feedback'}
    },
    init: function(){
        // console.log("init: Grabbing test");
    },

    play: function() {
        let data = this.data;
        let el = this.el;
        let grabStart = false;
        const SET_COMP_PROPS = AFRAME.utils.entity.setComponentProperty;// correct method to change attributes
        let sceneManager = data.sceneLocator.components.scenemgr;

        // On Hover stop object animations
        el.addEventListener('hover-start', function(evt) {
            console.log("Hover Start Event")
            let target = evt.detail.target;
            if(!grabStart){
                target.components.animation__pos.animation.pause();
                target.components.animation__rot.animation.pause();
                target.parentEl.children[1].components.animation__pos.animation.pause()
            }
        });

        // On leaving Hover resume animation
        el.addEventListener('hover-end', function(evt) {
            console.log("Hover End Event");
            let target = evt.detail.target;
            if(!grabStart){
                target.components.animation__pos.animation.play();
                target.components.animation__rot.animation.play();
                target.parentEl.children[1].components.animation__pos.animation.play()
            }
        });

        // Object has been picked up
        el.addEventListener('grab-start', function(evt) {
            console.log("Grab Start Event")
            grabStart = true;
        });

        // Player 'drops' object and object is collected
        el.addEventListener('grab-end', function(evt) {
            console.log("Grab End Event")
            grabStart = false;
            SET_COMP_PROPS(data.hudCopy, 'value', evt.detail.target.id);
            sceneManager.collectorMgmt(evt.detail.target);// Call scenemgr collectorMgmt method for collection
        });
    }
});

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

    // AFRAME.registerComponent('pixel-ratio', {
    //     schema: {
    //         type: 'number'
    //     },
    //     update: function() {
    //         this.el.sceneEl.renderer.setPixelRatio(this.data)
    //     }
    // });
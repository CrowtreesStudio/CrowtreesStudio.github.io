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
        uiButton:{type:'selector', default:'#uiButton'},
        
        beginScrn:{type:'selector', default:'#begin'},
        cursor:{type:'selector', default:'a-cursor'},
        rtHand:{type:'selector', default:'#leftHand'},
        ltHand:{type:'selector', default:'#rightHand'},
        fuelGem:{type:'selector', default:'#fuelGem'},
        submarine:{type:'selector', default:'#submarine'},

        activeCamRig:{type:'selector', default:'#cameraRig'},
        activeCam:{type:'selector', default:"#camera"},
        cineCam:{type:'selector', default:"#cinematic"},

        usingHMD:{type:'boolean', default:false},

        coinsNeeded:{type:'number', default:4},
        coinsCollected:{type:'number', default:0},
        fuelGemCollected:{type:'boolean', default:false},

        sound1:{type:'selector', default:'#oceanWaves'},
        sound2:{type:'selector', default:'#gemSnd'},
        sound3:{type:'selector', default:'#itemPickup'},
        sound4:{type:'selector', default:'#subEngine'},
        soundFirefox:{type:'selectorAll', default:'audio'}

    },
/* ######################################################################### */
    init: function(){
        const el = this.el;
        const data = this.data;
        el.setAttribute('vr-mode-ui', 'enabled', false);

        data.activeCamRig.setAttribute('movement-controls','enabled', false);
        data.submarine.setAttribute('class', 'not-clickable');//Submarine is not selectable

        /* UI Display and feedback */
        data.hudCopy.setAttribute('visible', false);// Hud feedback - moves with player, shows coins collected, instructions, etc
        data.uiTitle.setAttribute('value', 'Submariner Walkabout');// UI Panel display - introduction panel
        data.uiCopy.setAttribute('value', '\nYour task is an easy one.\nCollect all the blue coins to reveal the Fuel Gem.\nReturn to your submarine with the Fuel Gem to power your engine and end the game.\nGood luck!"');

        let message = "Version: 1.5.0";// Track changes in upper left corner
        document.getElementById("text").innerHTML= message;

        window.addEventListener('load', evt=>{
            // I'm leaving these here as a useful exploration
            console.log("Device check:", AFRAME.utils.device);
            console.log("WebXR enabled?:", AFRAME.utils.device.isWebXRAvailable);
            console.log("Is it a Browser?:", AFRAME.utils.device.isBrowserEnvironment);
            console.log("Is it a VR Display?:", AFRAME.utils.device.getVRDisplay());
            console.log("Is it iOS?:", AFRAME.utils.device.isIOS());
            console.log("Is it a HMD connected?:", AFRAME.utils.device.checkHeadsetConnected());
        });

        el.addEventListener('enter-vr', evt=>{
            console.log("entering VR mode");
            if(AFRAME.utils.device.checkHeadsetConnected() === true){
                message = "Welcome to the Submariner Walkabout";
                data.usingHMD=true;
                data.cursor.setAttribute('visible', false);// this works
                data.cursor.setAttribute('raycaster', 'enabled', false);// this works
                data.activeCamRig.setAttribute('movement-controls','enabled', false);
            }else{// we're on a desktop or mobile
                message = "Welcome to the Submariner Walkabout on desktop/mobile";
                el.setAttribute('vr-mode-ui', 'enabled', false);
                data.activeCamRig.setAttribute('movement-controls','enabled', true);
            };
        });
        
        el.addEventListener('exit-vr', evt=>{
            message = "Cursor visible";
            data.cursor.setAttribute('visible', true);// this works
            el.setAttribute('vr-mode-ui', 'enabled', true);
        });
        data.hudCopy.setAttribute('value', message);
    },

/* ######################################################################### */
    startExperience: function(){
        let el = this.el;
        let data = this.data;

        data.beginScrn.style.display = 'none';
        el.setAttribute('vr-mode-ui', 'enabled', true);

        data.sound1.components.sound.playSound();
        console.log("sound:", data.sound1);
    },
/* ######################################################################### */
    //HUD feedback and animation
    uiMethod: function(){
        let data = this.data;
        data.hudCopy.setAttribute('opacity', 1.0);        
        data.hudCopy.components.animation.animation.reset();
        data.hudCopy.components.animation__fade.animation.reset();
        this.delayAnim(data.hudCopy.components.animation.animation,1000);// call delayAnim method
        this.delayAnim(data.hudCopy.components.animation__fade.animation, 1000);
    },
    // Delay animation method
    delayAnim: function(target, delay){// mini function pretty much what it says
        console.log("delayAnim");
        setTimeout(function(){target.play()}, delay);
    },
/* ######################################################################### */
// major feedback loop
    /*****************************************/
    /*         Collection Management        */
    /*****************************************/
    collectorMgmt: function(selectedObj){
        let data = this.data;
        let position = new THREE.Vector3();// where is camera in real world coordinates
        let camPosition = data.activeCam.object3D.getWorldPosition(position);      
        selectedObj.parentEl.object3D.el.setAttribute('animation__collpos', 'to:'+camPosition.x+" "+(camPosition.y-0.1)+" "+camPosition.z);

        // Check to see if the triggered animation(s) have completed - better place to put this?
        let animFinish = selectedObj.parentEl.object3D.el;
        animFinish.addEventListener('animationcomplete__collscale', ()=>{
            selectedObj.object3D.el.setAttribute('visible', false);// this works
        });

        /* Check which object has been seleceted */
        let itemClicked = selectedObj.id.substr(0,4);
/* A Coin has been clicked */
        if(itemClicked === 'coin' && data.coinsCollected < data.coinsNeeded){
            data.coinsCollected++;// increment coin count
            if(data.coinsCollected<=1){// decide how to display coin count
                message = "You have 1 coin";
            }else{
                message = "You have "+data.coinsCollected.toString()+" coins";
            };
            message += " of "+data.coinsNeeded+" collected";// feedback - message displayed after all checks
            
            selectedObj.object3D.el.setAttribute('class', 'not-clickable not-grabbable');//coin is now not selectable
            
            selectedObj.parentEl.components.animation__collpos.animation.play();
            selectedObj.parentEl.components.animation__collscale.animation.play();
            data.sound3.components.sound.playSound();

            // Animate the Fuel Gem and make it clickable
            if(data.coinsCollected >= data.coinsNeeded && !data.fuelGemCollected){
                data.fuelGem.object3D.el.setAttribute('visible', true);// Make Fuel Gem visible
                data.fuelGem.children[0].setAttribute('class', 'clickable');//Make Fuel Gem Clickable
                data.fuelGem.children[0].components.animation__pos.animation.play();// Fuel Gem mesh
                data.fuelGem.children[1].components.animation__pos.animation.play();// Animate Point Light
                data.gemAnim = true;
                data.sound2.components.sound.playSound();
            };
/* Fuel Gem has been clicked */
        }else if(itemClicked === 'fuel' && data.coinsCollected >= data.coinsNeeded){// redundant check on coins?
            data.fuelGemCollected = true;//now the Submarine can be selected
            selectedObj.parentEl.components.animation__collpos.animation.play();// play animations
            selectedObj.parentEl.components.animation__collscale.animation.play();
            data.sound3.components.sound.playSound();// collection sound
            selectedObj.parentEl.children[1].components.animation__colllight.animation.play();// turn off light
            selectedObj.object3D.el.setAttribute('class', 'not-clickable not-grabbable');//Fuel Gem now not selectable
            data.submarine.setAttribute('class', 'clickable');//Submarine is selectable
            
            if(data.usingHMD){// Using HMD - Is this working?
                console.log("using HMD so enable raycasters on hands")
                data.ltHand.setAttribute('raycaster', 'enabled', true);
                data.rtHand.setAttribute('raycaster', 'enabled', true);
                data.ltHand.setAttribute('raycaster', 'far', 2.0);
                data.rtHand.setAttribute('raycaster', 'far', 2.0);
            }else{
                data.cursor.setAttribute('raycaster', 'far', 1.0);
            }
            message="Well Done! Return to the Submarine";
/* Submarine has been clicked */
        }else if(itemClicked === 'subm'){
            /* The Submarine has been selected and the game ends */
            data.activeCam.setAttribute('visible', false);
            data.activeCam.setAttribute('active', false);
            data.cineCam.setAttribute('visible', true);
            data.cineCam.setAttribute('active', true);
            data.ltHand.setAttribute('visible', false);
            data.rtHand.setAttribute('visible', false);
            data.submarine.setAttribute('animation-mixer', 'clip', 'prop_rotation');
            selectedObj.parentEl.components.animation.animation.play();
            data.sound4.components.sound.playSound();
            message="Get outta 'ere!";
/* Opening ui panel uiButton clicked */
        }else if(itemClicked === 'uiBu'){
            data.sound3.components.sound.playSound();
            data.activeCamRig.setAttribute('movement-controls','enabled', true);
            data.hudCopy.setAttribute('visible', true);
            data.uiGroup.setAttribute('visible', false);
            console.log("itemclick:", itemClicked);
            // SET_COMP_PROPS(data.uiButton, 'class', 'not-clickable');
            if(data.usingHMD){
                data.ltHand.setAttribute('raycaster', 'enabled', false);
                data.rtHand.setAttribute('raycaster', 'enabled', false);
            }else{
                // SET_COMP_PROPS(data.cursor, 'raycaster.far', 0.3);
                // SET_COMP_PROPS(data.activeCamRig, 'movement-controls.enabled', true);
            };
            message = "Collect "+data.coinsNeeded+" coins";
        };
        
        
        
        data.hudCopy.setAttribute('value', message);// display message on main screen for player feedback
        this.uiMethod();// a
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
            console.log("who is clicked?",target.id);
            if(!target.components.animation__pos){
                console.log("No animations");
            }else{
                target.components.animation__pos.animation.pause();
                target.components.animation__rot.animation.pause();
                if(target.id === 'fuel_gem'){
                    target.parentEl.children[1].components.animation__pos.animation.pause()
                }
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
                target.components.animation__rot.animation.play();
                if(target.id === 'fuel_gem'){
                    target.parentEl.children[1].components.animation__pos.animation.play()
                }
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
            data.hudCopy.setAttribute('value', evt.detail.target.id);
            sceneManager.collectorMgmt(evt.detail.target);// Call scenemgr collectorMgmt method for collection
        });
    }
});

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

    // AFRAME.registerComponent('pixel-ratio', {
    //     schema: {
    //         type: 'number'
    //     },
    //     update: function() {
    //         this.el.sceneEl.renderer.setPixelRatio(this.data)
    //     }
    // });
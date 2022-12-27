AFRAME.registerComponent('scenemgr', {
    // component properties held in schema
    schema:{
        browserCheck:{type:'boolean', default:false},
        deviceCheck:{type:'boolean', default:false},
        beginScrn:{type:'selector', default:'#begin'},
        
        pickups:{type:'number', default:0},
        
        diamondRevealed:{type:'boolean', default:false},
        diamond:{type:'selector', default:'#diamond'},
        light:{type:'selector', default:'#diamondLight'},
        
        submarine:{type:'selector', default:'#subRig'},
        sub:{type:'selector', default:'#submarine'},
        
        activeCamRig:{type:'selector', default:'#rig'},
        activeCam:{type:'selector', default:"#mainCam"},
        cineCam:{type:'selector', default:"#cinematic"},
        
        uiPanel:{type:'selector', default:'#uiGroup'},
        uiTitle:{type:'selector', default:"#uiTitle"},
        uiCopy:{type:'selector', default:"#uiCopy"},
        hud:{type:'selector', default:'#HUD'},
        hudCopy:{type:'selector', default:'#feedback'},
        
        fullLetter:{type:'selector', default:'#3Dletter'},
        
        sound1:{type:'selector', default:'#oceanWaves'},
        sound2:{type:'selector', default:'#gemSnd'},
        sound3:{type:'selector', default:'#itemPickup'},
        soundFirefox:{type:'selectorAll', default:'audio'},
    },
    
    init:function(){
        const el = this.el;
        let data = this.data;// to access properties in schema
        
        const SET_COMP_PROPS = AFRAME.utils.entity.setComponentProperty;

        document.querySelector('a-scene').addEventListener('loaded', (evt)=>{
            console.log("A-Scene has loaded");
        })
        
        data.activeCam.setAttribute('camera', 'active', true);
        
        let isFirefox = typeof InstallTrigger !== 'undefined';
        data.browserCheck = isFirefox;

        //Is this a mobile device?
        data.deviceCheck = AFRAME.utils.device.isMobile();
        if(data.deviceCheck === true){
            console.log("Is mobile");
            SET_COMP_PROPS(el, 'vr-mode-ui.enabled', true);
            SET_COMP_PROPS(data.activeCam, 'look-controls.enabled', true);
            SET_COMP_PROPS(data.hudCopy, 'text.wrapCount', 50);
        }else{
            console.log("Is desktop");
            SET_COMP_PROPS(data.activeCam, 'look-controls.pointerLockEnabled', true);
            SET_COMP_PROPS(data.activeCam, 'look-controls.enabled', true);
        }
        
        SET_COMP_PROPS(data.uiTitle, 'value', "Submariner Walkabout");
        SET_COMP_PROPS(data.uiCopy, 'value', "\nYour task is an easy one.\nCollect all the cubes to reveal the Fuel Gem.\nCollect the gem and return to your submarine.\nGood luck!");
        
        SET_COMP_PROPS(data.hudCopy, 'value', 'Number of Boxes Collected: '+data.pickups);

    },
    
    //component custom methods
    
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
            }
    },

    
    // UI Panels
    // HUD & feedback
    uiMethod: function(target, panel){
        let data = this.data;
        data.sound3.components.sound.playSound();        
        
        const SET_COMP_PROPS = AFRAME.utils.entity.setComponentProperty;
        // UI Panel
        SET_COMP_PROPS(data.uiPanel, 'visible', false);
        // button not clickable
        target.object.el.setAttribute('class', 'not-clickable');
    
        // show hud
        SET_COMP_PROPS(data.hud, 'visible', true);
        
        this.delayAnim(data.hudCopy.components.animation.animation, 1500);
        this.delayAnim(data.hudCopy.components.animation__fade.animation, 1500);
        
        // enable wasd & arrow keys for movement
        SET_COMP_PROPS(data.activeCamRig, 'movement-controls.enabled', true);
        
    },
    
    delayAnim: function(target, delay){
        console.log("delayAnim");
        setTimeout(function(){target.play()}, delay);
    },

    //component custom method
    collectorMethod:function(forCollection){
        var data = this.data;// to access properties in schema
        
        const SET_COMP_PROPS = AFRAME.utils.entity.setComponentProperty;
        
        if(forCollection.object.el.id === "diamond"){
            console.log("Call the damn sub");
            SET_COMP_PROPS(data.hudCopy, 'value', 'Your Submarine awaits! Time to go.');
            SET_COMP_PROPS(data.hudCopy, 'position', {x:0, y:0, z:0});
            SET_COMP_PROPS(data.hudCopy, 'opacity', 1.0);
            data.hudCopy.components.animation.animation.reset();
            data.hudCopy.components.animation__fade.animation.reset();
            this.delayAnim(data.hudCopy.components.animation.animation, 1500);
            this.delayAnim(data.hudCopy.components.animation__fade.animation, 1500);
            data.light.setAttribute('intensity', 0.0);
            forCollection.object.el.setAttribute('class', 'not-clickable');
            forCollection.object.el.setAttribute('visible', false);
            data.sub.setAttribute('class', 'clickable');
            data.sub.setAttribute('visible', true);
            
//            SET_COMP_PROPS(data.uiPanel, 'visible', true);
            
        }
        
        if(forCollection.object.el.id === "submarine"){
            SET_COMP_PROPS(data.hud, 'visible', false);
            data.activeCam.setAttribute('camera', 'active', false);
            data.activeCamRig.setAttribute('visible', false);
            data.cineCam.setAttribute('visible', true);
            data.cineCam.setAttribute('camera', 'active', true);
            data.cineCam.object3D.position.set(0, 0, 0);
            data.cineCam.object3D.rotation.set(
                THREE.Math.degToRad(0),
                THREE.Math.degToRad(0),
                THREE.Math.degToRad(0)
            );
            data.submarine.components.animation.animation.play();
        }
        
        if(data.pickups < 4){
            console.log("remove box");
            forCollection.object.el.setAttribute('class', 'not-clickable');
            forCollection.object.el.setAttribute('visible', false);
            data.pickups++;
            
            SET_COMP_PROPS(data.hudCopy, 'value', 'Number of Boxes Collected: '+data.pickups);
            SET_COMP_PROPS(data.hudCopy, 'position', {x:0, y:0, z:0});
            SET_COMP_PROPS(data.hudCopy, 'opacity', 1.0);
            data.hudCopy.components.animation.animation.reset();
            data.hudCopy.components.animation__fade.animation.reset();
            this.delayAnim(data.hudCopy.components.animation.animation, 1500);
            this.delayAnim(data.hudCopy.components.animation__fade.animation, 1500);
            if(data.browserCheck){
                data.soundFirefox[2].volume=0.5;// for firefox
                data.soundFirefox[2].play();// for firefox
            }else{
                data.sound3.components.sound.playSound();
            }
        }
        
        if(data.pickups === 4 && !data.diamondRevealed){
            //You have all the boxes! Show the diamond.
            SET_COMP_PROPS(data.hudCopy, 'value', 'Excellent! Now collect the gem.');
            data.diamond.setAttribute('class', 'clickable');
            data.diamond.setAttribute('visible', true);
            data.light.setAttribute('intensity', 1.0);
            data.diamondRevealed = true;
            if(data.browserCheck){
                data.soundFirefox[1].volume=0.1;// for firefox
                data.soundFirefox[1].play();// for firefox
            }else{
                data.sound2.components.sound.playSound();
            }
        }
    }
});


AFRAME.registerComponent('mesh-check', {
    // built-in method
    update:function(){
        this.el.addEventListener('model-loaded', ()=>{
            console.log("mesh check model loaded");
            const el = this.el;
            console.log("el", el.object3D);
            const obj = this.el.getObject3D('mesh');
            obj.children.forEach((model)=>{
                model.receiveShadow=true;
                if(model.name === "ground"){
                    model.castShadow=false;
                }else{
                    model.castShadow=true;
                    model.material.shadowSide=1;
                }
            });
        });
    }
});


AFRAME.registerComponent('pointer', {
    // built-in method
    init:function(){
        // grab scope
        const el = this.el;
        
        // On Click
        el.addEventListener('click', (e) => {

            // grab clicked target info
            let target = e.detail.intersection;
            console.log("target", target);

            // UI panels
            let uiCheck = target.object.el.parentEl;

            // Call Scene Manager Component
            let sceneManager = document.querySelector('#scene').components.scenemgr;
            console.log("scene mgr", sceneManager);

            if (uiCheck.id === "uiGroup") {
                sceneManager.uiMethod(target, uiCheck);
            } else {
                sceneManager.collectorMethod(target);
            };

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







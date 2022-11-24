AFRAME.registerComponent('scenemgr', {
    schema:{
        feedbackTXT:{type:'selector', default:'#feedback'}
    },

    init: function(){
        let data = this.data;
        let cursor = document.getElementsByTagName("a-cursor");
        let message = "";
        const SET_COMP_PROPS = AFRAME.utils.entity.setComponentProperty;

        if(AFRAME.utils.device.checkHeadsetConnected()==="true"){
            cursor.setAttribute('visible', false);
            message = "Cursor has been hidden";
            SET_COMP_PROPS(data.feedbackTXT, 'value', message);
        }else{
            message = "It's Desktop or Mobile";
            SET_COMP_PROPS(data.feedbackTXT, 'value', message);
        }
        console.log("Hello from scenemgr");
    },

    collectorMgmt: function(forCollection){
        console.log("Hello from collectorMgmt:", forCollection);
    }
});

/* ******************************************************** */
/* Component to listen for mouse click on entity - desktop  */
/* ******************************************************** */
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

/* *********************************************************** */
/* Component to listen for HMD controllers grabbing an entity  */
/* *********************************************************** */
AFRAME.registerComponent('grabbingtest', {
    schema:{
        feedbackTXT:{type:'selector', default:'#feedback'}
    },
    init: function(){
        let data = this.data;
        let message = "Version: 1.1.0";
        const SET_COMP_PROPS = AFRAME.utils.entity.setComponentProperty;
        SET_COMP_PROPS(data.feedbackTXT, 'value', "Listening...");
        document.getElementById("text").innerHTML= message;
    },
    play: function() {
        let data = this.data;
        let el = this.el;
        let sceneManager = document.querySelector('#scene').components.scenemgr;
        console.log("scene mgr", sceneManager);

        el.addEventListener('grab-start', function(evt) {
            console.log(evt);
            const SET_COMP_PROPS = AFRAME.utils.entity.setComponentProperty;// correct method to change attributes
            SET_COMP_PROPS(data.feedbackTXT, 'value', evt.detail.hand.id);
        });

        el.addEventListener('grab-end', function(evt) {
            console.log(evt);
            
            const SET_COMP_PROPS = AFRAME.utils.entity.setComponentProperty;
            SET_COMP_PROPS(data.feedbackTXT, 'value', evt.detail.target.id);

            SET_COMP_PROPS(evt.detail.target.object3D.el, 'color', '#'+(Math.random()*0xFFFFFF<<0).toString(16));// Works!
            sceneManager.collectorMgmt(evt.detail.target);
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
/* Working version 1.2.1 */
/* Includes teleport, grab, collect, device detection and mobile navigation */
/* Adding UI elements and game state changes (gameplay) */

AFRAME.registerComponent('scenemgr', {
    schema:{
        feedbackTXT:{type:'selector', default:'#feedback'},
        cursor:{type:'selector', default:'a-cursor'},

        activeCamRig:{type:'selector', default:'#cameraRig'},
        activeCam:{type:'selector', default:"#camera"},

    },

    init: function(){
        let el = this.el;
        let data = this.data;

        let message = "Version: 1.2.6";
        document.getElementById("text").innerHTML= message;
        message = "listening...";

        el.addEventListener('teleported', function (e) {// to track teleport events - will have use later?
            console.log(e.detail.oldPosition, e.detail.newPosition, e.detail.hitPoint,"Contents of Detail:", e.detail);
        });

        el.addEventListener('enter-vr', evt=>{
            // console.log("Device check:", AFRAME.utils.device);
            console.log("evt:", evt);
            if(AFRAME.utils.device.checkHeadsetConnected() === true){
                message = "Cursor has been hidden";
                data.cursor.setAttribute('visible', false);
                data.cursor.setAttribute('raycaster.enabled', false);
                data.activeCamRig.setAttribute('movement-controls.enabled', false);
            }else{
                message = "It's Desktop or Mobile";
                data.activeCamRig.setAttribute('movement-controls.enabled', true);
            };

        });
        
        el.addEventListener('exit-vr', evt=>{
            message = "Cursor visible";
            data.cursor.setAttribute('visible', true);
            data.cursor.setAttribute('raycaster.enabled', true);
            data.activeCamRig.setAttribute('movement-controls.enabled', true);
        });

        data.feedbackTXT.setAttribute('value', message);
    },

    collectorMgmt: function(forCollection){
        console.log("Hello from collectorMgmt:", forCollection);
        let data = this.data;
        let message = forCollection.id;
        data.feedbackTXT.setAttribute('value', message);
        forCollection.object3D.el.setAttribute('class', 'not-clickable');
        forCollection.object3D.el.setAttribute('visible', false);
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
        console.log("data:", this.data);
    },
    
    play:function(){
        const el = this.el;// grab scope
        let data = this.data;// grab schema data
        let grabit = false;
        
        // On click event
        el.addEventListener('click', (evt) => {
            console.log("clicked object");
            grabit = true;
            let target = evt.detail.intersectedEl;
            let sceneManager = data.sceneLocator.components.scenemgr;
            sceneManager.collectorMgmt(target);
        });

        // When hovering on a clickable item, change the cursor colour.
        el.addEventListener('mouseenter', (evt)=>{
            console.log("mouse enter");
            el.setAttribute('material', {color: '#00ff00'});
            let target = evt.detail.intersectedEl;
            target.object3D.el.setAttribute('color', '#'+(Math.random()*0xFFFFFF<<0).toString(16));// just for fun
            if(target.components.animation__pos && !grabit){
                target.components.animation__pos.animation.pause();
            }else{
                console.log("No animations");
            }
        });

        el.addEventListener('mouseleave', (evt)=>{
            console.log("mouse leave");
           el.setAttribute('material', {color: '#ffffff'});
           let target = evt.detail.intersectedEl;
            if(target.components.animation__pos && !grabit){
                target.components.animation__pos.animation.play();
            }else{
                console.log("No animations");
            } 
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

/* *********************************************************** */
/*   Component to start play animations on an entity object    */
/* *********************************************************** */
AFRAME.registerComponent('animstart', {
    init: function(){
        let el = this.el;
        console.log("Animation Component:", el.components);
        el.components.animation__pos.animation.play();
    }
});

AFRAME.registerComponent('scenemgr', {
    // component properties held in schema
    schema:{
        animationLib:{type:'array', default:[]},
        // deviceCheck:{type:'boolean', default:false},
        // cineCam:{type:'selector', default:"#cinematic"},
        // pickups:{type:'number', default:0},
        // feedback:{type:'string', default:"Hello World"}
    },
    
    init:function(){
        const el = this.el;
        let data = this.data;// to access properties in schema
    //     const SET_COMP_PROPS = AFRAME.utils.entity.setComponentProperty;
        console.log("Hello World", el);
        
    //     // data.activeCam.setAttribute('camera', 'active', true);
        
    //     // SET_COMP_PROPS(data.uiTitle, 'value', "Submariner Walkabout");
    //     // SET_COMP_PROPS(data.uiCopy, 'value', "\nYour task is an easy one.\nCollect all the cubes to reveal the Fuel Gem.\nCollect the gem and return to your submarine.\nGood luck!");
    //     // SET_COMP_PROPS(data.hudCopy, 'value', 'Number of Boxes Collected: '+data.pickups);

    },

    addAnimation: function(animLib){
        console.log("add animation method");
        const SET_COMP_PROPS = AFRAME.utils.entity.setComponentProperty;
        let data = this.data;
        SET_COMP_PROPS(data.animationLib, 'value', animLib);
    }

});

// FIRST useful registered Component!!! - July 17, 2019
AFRAME.registerComponent('mesh-data', {
    init: function(){
        //wait for model to load

        this.el.addEventListener('model-loaded', () => {
            // Something to use to for a preloader?
            console.log(this.el.id+" loaded");
            let sceneManager = document.querySelector('#scene').components.scenemgr;
            // let sceneManager = document.querySelector('#scene').components.scenemgr;
            console.log("This is the scenemgr", sceneManager);
            
            // Grab the mesh/scene
            const obj = this.el.getObject3D('mesh');
            console.log("Entity elements",this.el);
            let ident = this.el.id;
            console.log("Mesh "+ident,obj);

            // Fixing character or gltf meshes from blinking out (no longer visible)
            // this below does nothing
            // obj.frustumCulled = false;
            // We need to dig down to the 'skinnedmesh'property
            obj.children[0].children[3].frustumCulled = false;// this fixes it
            // Ideally, we can do a node search to find the 'skinnedmesh' as other objects will
            // most likely suffer the same problem but will not be necessarily always
            // register 3 within a children array

            // Since frustumCulled is off, we need to 'manually' hide meshes
            // or turn frustumCulled back on
            obj.visible = true;

            // useful for parsing for elements
            // clean method for scanning for bones (based on isMesh version)
            // obj.traverse(function(node){
            //     if(node.isBone){
            //         console.log(node.name);
            //     }
            // })
            
            // Grab the animations array
            let animNode = obj.animations;
            let animLib = animNode;
           console.log("Animation", animNode);
           if(ident === "Player3"){
            console.log("Animation Library is Player 3");
            sceneManager.addAnimation(animLib);
           } else {
            console.log("nothing here");
           }
            
            // let list = document.getElementById('controls');
            // let item = list.getElementsByTagName('button');
            
            // Parse the array for animation segments
            // let i = 0;
            // obj.animations.forEach(function(node){
            //     if(item[i]!== undefined){
            //         item[i].innerHTML=node.name;
            //         i++;
            //     }
                
            // })
        });
    }
});

// AFRAME.registerComponent('contact-listener', {
//     init: function () {
//         var message = "Now it's ";
//         let object = this.el.id;
//         let color = '#9300ff';
        
//         console.log("hello world", object);
        
//         this.el.addEventListener('over', function(evt){
//             document.getElementById("text").setAttribute("value", message+object);
//             this.setAttribute('material', 'color', color);
//         });
        
//        this.el.addEventListener('click', function (evt) {
//            lastIndex = (lastIndex + 1) % COLORS.length;
//            this.setAttribute('material', 'color', COLORS[lastIndex]);
//            console.log('I was clicked at: ', evt.detail.intersection.point);
//            document.getElementById("text").setAttribute("value", message+COLORS[lastIndex]);
//        });
//     }
// });

// AFRAME.registerComponent('controllisten', {
//     init: function(){
//         let el = this.el;// controller
//         let id = el.id;
//         let player = document.getElementById("cameraRig");
//         // console.log("player is",player);
//         // console.log("testing", el);
//         // console.log("test2", id);
//         // console.log('next: thumbstick activation!');
//         el.addEventListener('axismove', function(evt){
//             console.log('thumb stick moved');
//             //test code for thumbstick courtesy SirFizX & Pavel
//             if(evt.detail.axis[2]>0.5){
//                 console.log("rotate view to the right");
//                 player.object3D.rotation.y-=0.05;
//             }else if(evt.detail.axis[2]<-0.5){
//                 console.log("rotate view to the left");
//                 player.object3D.rotation.y+=0.05;
//             };
            
//             if(evt.detail.axis[3]>0.5){
//                 console.log("move back");
//             }else if(evt.detail.axis[3]<-0.5){
//                 console.log("move forward");
//             };
//         });
//     }
// });

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
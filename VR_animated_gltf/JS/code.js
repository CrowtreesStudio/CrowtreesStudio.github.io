AFRAME.registerComponent('scenemgr', {
    // component properties held in schema
    schema:{
        animationLib:{type:'array', default:[]},
        player1:{type:'selector', default:'#Player1'},
        player2:{type:'selector', default:'#Player2'},
        player3:{type:'selector', default:'#Player3'},
        player4:{type:'selector', default:'#Player4'}
    },

    addAnimation: function(animLib){
        console.log("add animation method");
        let data = this.data;
        data.animationLib = animLib;
        console.log('animation lib is', data.animationLib);
    }

});

AFRAME.registerComponent('character-setup', {
    schema:{
        modelSkin:{type:'string', default:'Cowboy'}
    },
    init: function(){
        //wait for model to load
        this.el.addEventListener('model-loaded', () => {
            // Something to use to for a preloader?
            console.log(this.el.id+" loaded");
            
            // Grab the mesh/scene
            const obj = this.el.getObject3D('mesh');
            console.log("Look at mesh", obj);
            let ident = this.el.id;
            console.log("identify models available", obj);
            console.log("Find Element depth",obj.children[0].children);
            obj.children[0].children.forEach(element => {
                console.log("element", element);
                if(element != "Bone"){
                    element.visible = false;
                    element.frustumCulled = false;// stops culling (blinking)
                }

                if(element.name === "Character_"+this.data.modelSkin){
                    element.visible = true;
                }
            });
        });
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
            let data = sceneManager.data;
            
            // Grab the mesh/scene
            const obj = this.el.getObject3D('mesh');
            let ident = this.el.id;

            /**********************************************/
            /**********************************************/
            // Fixing character or gltf meshes from blinking out (no longer visible)

            // this below does nothing
            // obj.frustumCulled = false;

            // We need to dig down to the 'skinnedmesh'property
            obj.children[0].children[3].frustumCulled = false;// this fixes it
            // Ideally, we can do a node search to find the 'skinnedmesh' as other objects will
            // most likely suffer the same problem but will not be necessarily always
            // register 3 within a children array

            /**********************************************/
            // Since frustumCulled is off, we need to 'manually' hide meshes
            // or turn frustumCulled back on
            // obj.visible = true;

            /**********************************************/
            // useful for parsing for elements
            // clean method for scanning for bones (based on isMesh version)
            // obj.traverse(function(node){
            //     if(node.isBone){
            //         console.log(node.name);
            //     }
            // })

            /**********************************************/
            // Grab the animations array from selected model
            // if(ident === "Player1"){
            //     let animNode = obj.animations;
            //     sceneManager.addAnimation(animNode);
            // } else {
            //     obj.animations = sceneManager.data.animationLib;
            // }

            // if(ident === "Player1"){
            //     // console.log("Check target for animation",data.player1);
            //     console.log("mesh contents of Player1?", data.player1.getObject3D('mesh'));
            //     data.player1.setAttribute('animation-mixer', {clip:'Idle', timeScale:1.0});
            // }else if(ident === "Player2"){
            //     // console.log("Check target for animation",data.player2);
            //     console.log("mesh contents of Player2?", data.player2.getObject3D('mesh'));
            //     data.player1.setAttribute('animation-mixer', {clip:'Idle', timeScale:1.0});
            // }else if(ident === "Player3"){
            //     console.log("mesh contents of Player3?", data.player3.getObject3D('mesh'));
            //     data.player3.setAttribute('animation-mixer', {clip:'Idle', timeScale:0.25});
            // }else if(ident === "Player4"){
            //     data.player4.setAttribute('animation-mixer', {clip:'Idle', timeScale:0.25});
            //     console.log("mesh contents of Player4?", data.player4.getObject3D('mesh'));
            // };

            /**********************************************/
            /**********************************************/
            /**********************************************/
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
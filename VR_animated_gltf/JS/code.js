AFRAME.registerComponent('scenemgr', {
    init: function(){
        let el = this.el;
        console.log("Contents of Scene:", el);
        console.log("Can I get the tag:",document.getElementsByTagName("img"));

    }
})

AFRAME.registerComponent('character-setup', {
    schema:{
        modelSkin:{type:'string', default:'Nude'},
        modelItem:{type:'array', default:[]}, // want this to be an array
        modelTexture:{type:'map', default:'#Brown'}
    },
    init: function(){
        //wait for model to load
        this.el.addEventListener('model-loaded', () => {

            let data = this.data;// path to schema data
            let el = this.el;// get element

            // Something to use to for a preloader?
            console.log(el.id," loaded");            
            // Grab the mesh/scene
            const obj = el.getObject3D('mesh');
            console.log("Take a look inside the mesh", obj);

            obj.traverse(function(node){
                if(node.isMesh){
                    node.frustumCulled = false;// stops culling (blinking)

                    /* **************************************************************** */
                    /*      Let's hide everything first and then show the correct       */
                    /*      meshes for both characters and items they are carrying      */
                    /* **************************************************************** */
                    if(node.name != "Character_"+data.modelSkin){
                        node.visible = false;
                    };


                    /* ************************************************************* */
                    /*              Add Selected Texture to Character                */
                    /* ************************************************************* */
                    // Apply Character Textures 
                    let material01 = new THREE.TextureLoader().load(data.modelTexture.src);
                    if(el.components["gltf-model"].attrValue === "#Adventure"){
                        console.log("Which character group has been attached:", el.components["gltf-model"].attrValue);
                        let texture = node.material;
                        texture.map = material01;
                        texture.map.flipY = false;
                        texture.map.encoding = THREE.sRGBE;
                            
                    }else if(el.components["gltf-model"].attrValue === "#Western"){
                        /*      Note: Western textures are as follows               */
                        /*      Skin Colour changes _A:White, _B:Brown, _C:Black    */
                        /*      Costume changes _01_, _02_, _03_, _04_                  */
                        console.log("Which character group has been attached:", el.components["gltf-model"].attrValue);
                        let texture = node.material;
                        texture.map = material01;
                        texture.map.flipY = false;
                        texture.map.encoding = THREE.sRGBE;
                            
                    };

                    /* ************************************************************* */
                    /*          Place Items (make visible) On Character              */
                    /* ************************************************************* */
                    if(node.name === "Item_"+data.modelItem){
                        node.visible = true;
                    };

                };
            });

        });// End addEventListner - 'model-loaded'
    }// End Init Function
});// End registerComponent
    
AFRAME.registerComponent('mesh-data', {
    init: function(){
        //wait for model to load - - Use this for a preloader function
        this.el.addEventListener('model-loaded', () => {
            
            // Grab the mesh/scene
            const obj = this.el.getObject3D('mesh');
            
            // if it's not there return
            if(!obj){return;}
            
            obj.traverse(function(node){
                if(node.isMesh){
                //    console.log("WHat did you find node?:",node.name);
                    
                    if(node.name==="boxUv"){
                        console.log(node.name);
                        console.log(node.material);
//                         node.material.metalness = 0.0;
//                         node.material.roughness = 0.5;
//                         node.material.name = "UVboxTexture";
                        
// //                        node.material.color=new THREE.Color(0xffffff);
//                         node.material.color={r:1, g:1, b:1};
//                         node.material.map= new THREE.TextureLoader().load( "assets/textures/20080817_0044_0001.JPG");
//                         let repeat = 6;
//                         node.material.map.repeat = {x:repeat, y:repeat};
//                         node.material.map.wrapS = 1000;
//                         node.material.map.wrapT = 1000;
                        
//                     }
//                     if(node.name ==="floor"){
//                         node.material.map.repeat = {x:2,y:2};
//                     };
                    
//                     if(node.name ==="boxUvTextured"){
// /*                        console.log(node.name);
//                         console.log(node.material);*/
//                        node.material.map=new THREE.TextureLoader().load("assets/textures/20080906_0018_0001.JPG");
//                         // node.material.map= new THREE.TextureLoader().load( "assets/textures/20080817_0044_0001.JPG");
//                         node.material.map.repeat = {x:3,y:3};
//                         node.material.map.wrapS = 1000;
//                         node.material.map.wrapT = 1000;
                    }
                }
            });
            
            
            
            
            
            //useful for parsing for elements
            /*let list = document.getElementById('controls');
            let item = list.getElementsByTagName("li");*/
            
            // Parse the array for animation segments
            /*let i = 0;
            obj.animations.forEach(function(node){
                item[i].innerHTML=node.name;
                i++;
            })*/
        })
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
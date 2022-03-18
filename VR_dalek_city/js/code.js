//let doorObj;
let loaded = false;

window.onload = ()=>{
    
//    let preloadMods = ['#dalekSound', 'a-scene', '#navigationMesh','#dalekModel','#scene'];
    let preloadMods = ['a-scene','#dalekModel','#scene'];
//    console.log(preloadMods.length);
        
    let loader = setInterval(checkLoad, 1000);
    
    function checkLoad(){
        console.log("check load");
        console.log(preloadMods.length);
//        console.log(preloadMods[0]);
        
        if(preloadMods.length <=0){
            console.log("Loaded!");
            document.getElementById("button").style.display = "block";
            document.getElementById("preloader").style.visibility = "hidden";
            loaded = true;
            clearInterval(loader);
            console.log("loaded = "+loaded)
        }
    }
    
    
    init();
    document.querySelector('a-scene').addEventListener('loaded', function () {
        console.log("scene loaded");
        preloadMods.pop();
    });
    
    // Hide logo when entering VR mode
    let test = parent.document.getElementById("logo");
    document.querySelector('a-scene').addEventListener('enter-vr', function () {
        console.log("ENTERED VR");
        test.style.visibility = "hidden";
    });
    
    document.querySelector('a-scene').addEventListener('exit-vr', function () {
        console.log("EXIT VR");
        test.style.visibility = "visible";
    });
    
    document.querySelector('#scene').addEventListener('model-loaded', ()=>{
        preloadMods.pop();
        console.log("room loaded");
    });
    document.querySelector('#dalekModel').addEventListener('model-loaded', ()=>{
        preloadMods.pop();
        console.log("Dalek loaded");
    });
    document.querySelector('#navigationMesh').addEventListener('model-loaded', ()=>{
        preloadMods.pop();
        console.log("navmesh loaded");
    });
    
    document.querySelector('#dalekSound').addEventListener('sound-loaded', ()=>{
        console.log("sound loaded");
        preloadMods.pop();
    });
}

function init(){
 
}

AFRAME.registerComponent('load-model', {
    schema:{
        lookBone:{default:null},
        shadow:{default:false}
    },
    
    init:function(){
        const el = this.el;
        let animation = false;
        let path = "";
        let type = ""
        
        this.el.addEventListener('model-loaded', ()=>{
            let mesh = this.el.getObject3D('mesh');
            
            // Check for animations
            if(mesh.animations.length >0){
//                console.log("there are animations");
                animation = true;
            }
            
//            console.log(mesh.children.length);
//            console.log(mesh);
            if(mesh.children.length > 1){
                path = mesh.children;
            }else{
                path = mesh.children[0].children;
            }
            
        
            if(path.length > 1){
                path.forEach((element)=>{
                    switch(element.type){
                        case 'Bone':
                            console.log("it's a bone so ignore it");
                            break;
                        case 'Group':
                            console.log("it's a Model Mesh");
                            el.model = element;
                            type = "Model";
                            break;
                        case 'Mesh':
                            console.log("it's an unrigged Model Mesh");
                            el.model = element.parent;
                            type = "Model";
                            break;
                    }
                })
            };
            console.log("Next search");
            console.log("found the model");
            if(shadow!==false){
                for(let i=0; i<el.model.children.length; i++){
                    el.model.children[i].material.shadowSide = 1;
                    el.model.children[i].material.castShadow = true;
                }
            }
        });
    }
});

AFRAME.registerComponent('load-rig', {
    schema:{
        bone:{default:null}
    },
    
    init: function(){
        let path = "";
        let type = "";
        let rig = "";
        
        this.el.addEventListener('model-loaded', ()=>{
            let mesh = this.el.getObject3D('mesh');
            
            // Check for animations
            if(mesh.animations.length >0){
//                console.log("there are animations");
                animation = true;
            }
            
            path = mesh.children[0].children;
            console.log(path);
                
            path.forEach((element)=>{
                switch(element.type){
                    case 'Bone':
                        console.log("it's a bone so grab it");
                        type = "Bone";
                        rig = element;
                        break;
                    case 'Group':
                        console.log("it's the Model so ignore it");
                        break;
                }
            });
            
            rig.children.forEach((bone)=>{
                    if(bone.name === this.data.bone){
                        console.log("found the right bone");
                        this.data.bone = bone;
                    }
             });
            
//            console.log("Log the find");
//            console.log(this.data.bone);
            // What to look with
            this.el.setAttribute('stare-at','lookWith', this.data.bone);
            console.log(this.el.getAttribute('stare-at'));
        });
    }  
});

AFRAME.registerComponent('stare-at', {
    
    schema:{
        event:{default:null},
        targetObj:{default:'empty'},
        playerPos:{default:null},
        lookWith:{default:null}
    },
    
    init: function(){
        let playerCam = document.querySelector(this.data.targetObj);
        this.data.playerPos = playerCam.object3D.position;
        console.log("look with 1", this.data.lookWith);
        console.log("look with 2", this.data);
    },
    
    tick: function(){
        this.data.lookWith.lookAt(this.data.playerPos.x+0.3, 1, this.data.playerPos.z+3);
        console.log("Player Pos",this.data.playerPos.x);
    }
    
});ß

/*AFRAME.registerComponent('nav-pointer', {
    init:function(){
        const el = this.el;
//        console.log(el);
//        console.log(el.sceneEl);       
        
        
        // On Click, send NPC to the target location.
        el.addEventListener('click', (e)=>{
            const ctrlEl = el.sceneEl.querySelector('[nav-agent]');
            ctrlEl.setAttribute('nav-agent', {
                active:true,
                destination:e.detail.intersection.point
            });
        });
        
        // When hovering on the nav mesh, show a green cursor.
        el.addEventListener('mouseenter', ()=>{
            el.setAttribute('material', {color: 'green'});
        });
        el.addEventListener('mouseleave', ()=>{
           el.setAttribute('material', {color: 'crimson'}); 
        });
        
        // Refresh the raycaster after models load.
        if(loaded){
            el.sceneEl.addEventListener('object3dset', ()=>{
                this.el.Components.raycaster.refreshObjects();
            });
        };
        
    }
});*/

function hidePlay(){
    //hide button and colour screen
    console.log("Play sound and hide me!");
    document.getElementById("loading").style.display = "none";
    let sc = document.getElementById("MainScene").style.visibility="visible";
    var sound1 = document.querySelector('#dalekSound');
    sound1.components.sound.playSound();
}

/**
 * Removes current element if on a mobile device.
 */
AFRAME.registerComponent('not-mobile',  {
  init: function () {
    var el = this.el;
    if (el.sceneEl.isMobile) {
      el.parentEl.remove(el);
    }
  }
});

//AFRAME.registerComponent('log', {
//  schema: {type: 'string'},
//  init: function () {
//    var stringToLog = this.data;
//    console.log(stringToLog);
//  }
//});






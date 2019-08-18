//let doorObj;
let loaded = false;

window.onload = ()=>{
    init();
    document.querySelector('a-scene').addEventListener('loaded', function () {
      document.getElementById("button").style.display = "block";
      document.getElementById("preloader").style.visibility = "hidden";
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
}

function init(){
    this.playerCam = document.querySelector("#rig");
    this.playerCam = playerCam.object3D.position;
    this.lookBone="";    
    this.el=document.querySelector("#scene") ;
    this.el.addEventListener('model-loaded', ()=>{
        const obj = this.el.getObject3D('mesh');
        
        console.log(obj.children);
        
        let matt = document.querySelector("#ruffNMap");

        obj.children.forEach((model)=>{
            model.receiveShadow=true;
            if(model.name === "Ground_Plane"){
                model.castShadow=false;
            }else{
                model.castShadow=true;
                
                // check to make sure there is a material available
                // to affect
                if(model.material){
                    model.material.shadowSide=1;
                }
                // If model has more than one material
                if(!model.material){
                    if(model.children.length >0){
                        for(let i = 0; i<model.children.length; i++){
                            model.children[i].material.shadowSide=1;
                            model.children[i].castShadow=true;
                        }
                    }
                }
            }
        });
    });
    
    this.el2=document.querySelector("#dalekModel");
    
    this.el2.addEventListener('model-loaded', ()=>{
        const dalek = this.el2.getObject3D('mesh');
        console.log(dalek.children[0].children);
        dalek.children[0].children.forEach((model)=>{
            console.log(model.name);
            
            if(model.name === "BoneRoot"){
                console.log("Bones!");
                model.children.forEach((model)=>{
                    if(model.name === "BoneDome"){
                        console.log("bone dome located");
                        lookBone = model;
                    }
                })
            }
            
            if(model.name ==="DalekLowPoly"){
                console.log("A Dalek!");
                console.log("Number of materials = "+model.children.length);
                for(let i=0; i<model.children.length; i++){
                    console.log("material name = "+model.children[i].material.name);
                    console.log(model.children[i].material);
                    model.children[i].material.shadowSide = 1;
                    model.children[i].castShadow = true;
                }
            }            
        });
        animate();
    });
}




function animate() {
        requestAnimationFrame(animate);    
//    console.log(lookBone);
    // Dalek watches player
        lookBone.lookAt(playerCam.x, 1.3, playerCam.z);

}

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
    document.getElementById("begin").style.display = "none";
    let sc = document.getElementById("MainScene").style.visibility="visible";
    var sound1 = document.querySelector('#dalekSound');
    sound1.components.sound.playSound();
}






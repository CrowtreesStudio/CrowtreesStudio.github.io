/* ********************************************************************** */
/*   Component to parse mesh objects and apply shadows: receive & cast    */
/* ********************************************************************** */
AFRAME.registerComponent('mesh-shadows', {
    // built-in method
    update:function(){

        this.el.addEventListener('model-loaded', ()=>{

            const el = this.el;
            const obj = el.getObject3D('mesh');
            console.log("Model loaded", obj.name);
            obj.traverse(function(node){
                if(node.isMesh && node.name != "SM_Generic_CloudRing_01001"){
                    console.log("Found a Mesh:", node.name);
                    node.castShadow=true;
                    node.receiveShadow=true;
                    node.material.map.encoding = THREE.LinearEncoding;
                    node.material.shadowSide=1;
                    node.material.roughness=0.75;
                }else if(node.isMesh){
                    console.log("Node found called:", node.name);
                    node.castShadow=false;
                    node.receiveShadow=false;
                    node.material.shadowSide=1;
                    node.material.roughness=0.75;
                }
            });

            // obj.children.forEach((model)=>{
            //     console.log("Model Name:", model.name);
            //     if(model.children.length > 0){
            //         // console.log("There are children", model.children);
            //         model.children.forEach((node)=>{
            //             console.log("node:", node.name);
            //             if(node.type === 'Mesh' || node.type === 'SkinnedMesh'){
            //                 node.castShadow=true;
            //                 node.receiveShadow=true;
            //                 node.material.shadowSide=1;
            //             }else{
            //                 return;
            //             }
            //         });
            //     }else{
            //         // console.log("Simple shadow activation for", model.name);
            //         model.castShadow=true;
            //         model.receiveShadow=true;
            //         model.material.shadowSide=1;
            //     };
            // });
        });
    }
});
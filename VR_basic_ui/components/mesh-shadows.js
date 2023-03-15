/* ********************************************************************** */
/*   Component to parse mesh objects and apply shadows: receive & cast    */
/* ********************************************************************** */
AFRAME.registerComponent('mesh-shadows', {
    // built-in method
    update:function(){

        this.el.addEventListener('model-loaded', ()=>{

            const el = this.el;
            const obj = el.getObject3D('mesh');

            obj.children.forEach((model)=>{
                if(model.children.length > 0){
                    console.log("There are children", model);
                    model.children.forEach((node)=>{
                        node.castShadow=true;
                        node.receiveShadow=true;
                        node.material.shadowSide=1;
                    });
                }else{
                    console.log("Simple shadow activation for", model.name);
                    model.castShadow=true;
                    model.receiveShadow=true;
                    model.material.shadowSide=1;
                };
            });
        });
    }
});
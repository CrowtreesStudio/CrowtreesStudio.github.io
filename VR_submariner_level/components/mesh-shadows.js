/* ********************************************************************** */
/*   Component to parse mesh objects and apply shadows: receive & cast    */
/* ********************************************************************** */
AFRAME.registerComponent('mesh-shadows', {
    // built-in method
    update:function(){
        this.el.addEventListener('model-loaded', ()=>{
            console.log("mesh check model loaded");
            const el = this.el;
            const obj = this.el.getObject3D('mesh');
            obj.children.forEach((model)=>{
                model.material.shadowSide=1;
                if(model.name === 'ground'){
                    model.castShadow=false;
                    model.receiveShadow=true;
                }else if(model.name != 'coin'){
                    // model.castShadow=true;
                    // model.receiveShadow=true;
                }else{
                    model.castShadow=true;
                    model.receiveShadow=true;
                }
            });
        });
    }
});
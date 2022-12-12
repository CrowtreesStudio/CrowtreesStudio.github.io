AFRAME.registerComponent('mesh-shadows', {
    // built-in method
    update:function(){
        this.el.addEventListener('model-loaded', ()=>{
            // console.log("mesh check model loaded");
            const el = this.el;
            console.log("el to show object", el.getObject3D('mesh'));
            const obj = this.el.getObject3D('mesh');
            obj.children.forEach((model)=>{
                model.receiveShadow=true;
                if(model.name === "ground"){
                    model.castShadow=false;
                }else{
                    model.castShadow=true;
                    model.material.shadowSide=1;
                }
            });
        });
    }
});
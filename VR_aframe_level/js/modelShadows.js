// Attached to model entities in your scene

AFRAME.registerComponent('model-shadows', {
    // built-in method
    update:function(){
        this.el.addEventListener('model-loaded', ()=>{
            // this is who I'm attached to
            const el = this.el;
            
            // if there's a model here...
            const obj = this.el.getObject3D('mesh');
            
            // look through the children one at a time
            obj.children.forEach((model)=>{
                // receive shadow is always true
                model.receiveShadow=true;
                
                // we're more careful about who CASTs a shadow though
                if(model.name === "ground"){
                    model.castShadow=false;// nope, no need. You're the ground
                }else{
                    model.castShadow=true;// cast away me hearties!
                    model.material.shadowSide=1;// but shadows only on 1 face
                }
            });
        });
    }
});
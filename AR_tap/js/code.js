AFRAME.registerComponent('scenemgr', {
    // component properties held in schema
    schema:{
        isMarkerVisible:{type:'boolean', default:false},
        submarine:{type:'selector', default:'#submarine'},
        increment:{type:'number', default:0.05},
        scaleVal:{type:'number', default:0.15}
    },

    init:function(){
        const el = this.el;// scene
        const data = this.data;// property scope
        const sceneManager = el.components.scenemgr;//self reference
        
        console.log("is marker visible", data.isMarkerVisible);
        
        AFRAME.utils.entity.setComponentProperty(data.submarine, 'scale', {x:data.scaleVal, y:data.scaleVal, z:data.scaleVal});
                
        /*******************************/
        // Marker tracking: Lost & Found
        /*******************************/
        el.addEventListener("markerFound", (e) => {
            data.isMarkerVisible = true;
            console.log("I see the marker", data.isMarkerVisible);            
            sceneManager.animWatch();
        });
        
        el.addEventListener("markerLost", (e) => {
            data.isMarkerVisible = false;
            console.log("I lost the marker", data.isMarkerVisible);
            sceneManager.animWatch();
        });
    },
    
    
    /*****************************************/
    // Marker tracking: stop or play animation
    /*****************************************/
    animWatch:function(){
        const data = this.data;        
        if(data.isMarkerVisible){
            data.submarine.components.animation.animation.play();
        }else{
            data.submarine.components.animation.animation.pause();
        }
    }
    
});

AFRAME.registerComponent('pointer', {
    
    // built-in method
    init:function(){
        
        let data;// filled in loaded below
        
        // make sure scene has loaded before asking for data from scenemgr
        document.querySelector(['#scene']).addEventListener('loaded', ()=>{
            // get schema from scenemgr component
            data = document.querySelector(['#scene']).components.scenemgr.data;
        });
        
        // grab scope
        const el = this.el;

        // On Click
        el.addEventListener('click', (e)=>{
            // grab clicked target info
            let target = e.detail.intersectedEl;
            data.scaleVal += data.increment;
            target.setAttribute('scale', {x:data.scaleVal, y:data.scaleVal, z:data.scaleVal});

        });
        // When hovering on a clickable item, change the cursor colour.
        el.addEventListener('mouseenter', ()=>{
            el.setAttribute('material', {color: '#00ff00'});
            el.setAttribute('material', {opacity: 1});
        });
        el.addEventListener('mouseleave', ()=>{
            el.setAttribute('material', {color: '#ffffff'});
           el.setAttribute('material', {opacity: 0.25});
        });

    }
});
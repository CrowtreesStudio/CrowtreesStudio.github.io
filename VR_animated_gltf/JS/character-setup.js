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
                console.log("Node Name:", node.name)
                if(node.isMesh){
                    node.frustumCulled = false;// stops culling (blinking)

                    /* **************************************************************** */
                    /*      Let's hide all character meshes except the one we want      */
                    /*      and hide all the items (if any) they are carrying           */
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
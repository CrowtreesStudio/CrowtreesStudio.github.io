AFRAME.registerComponent('character-setup', {
    schema:{
        modelMesh:{type:'string', default:'Nude_Male'},
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
            // console.log("Take a look inside the mesh", obj);

            obj.traverse(function(node){
                if(node.isMesh){
                    node.frustumCulled = false;// stops culling (blinking)
                    console.log("Characters & Items Available:", node.name);

                    /* **************************************************************** */
                    /*      Let's hide all character meshes except the one we want      */
                    /*      and hide all the items (if any) they are carrying           */
                    /* **************************************************************** */
                    if(node.name != "Character_"+data.modelMesh){
                        node.visible = false;
                    };


                    /* ************************************************************* */
                    /*              Add Selected Texture to Character                */
                    /* ************************************************************* */
                    // Apply Character Textures 
                    let material01 = new THREE.TextureLoader().load(data.modelTexture.src);
                    let texture = node.material;
                    texture.map = material01;
                    texture.map.flipY = false;
                    // texture.map.encoding = THREE.sRGBE;
                    texture.map.encoding = THREE.LinearEncoding;

                    /* ************************************************************* */
                    /*          Place Items (make visible) On Character              */
                    /* ************************************************************* */
                    if(data.modelItem.length > 0){
                        data.modelItem.forEach((item) => {
                            if(node.name === item){
                                node.visible = true;
                            }
                        });
                    };
                };
            });

        });// End addEventListner - 'model-loaded'
    }// End Init Function
});// End registerComponent
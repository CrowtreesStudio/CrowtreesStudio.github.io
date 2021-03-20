window.onload = () => {
    //    console.log("loaded");
    /*let el = document.querySelector('#imgTexture');
    console.log(el.id);*/
}

AFRAME.registerComponent('mesh-data', {
    init: function () {
        //wait for model to load
        this.el.addEventListener('model-loaded', () => {
            // Something to use to for a preloader?
            console.log(this.el.id, "is loaded");

            // Grab the mesh/scene
            const obj = this.el.getObject3D('mesh');
            console.log(obj);
            console.log(obj.children.length);

            // Parse Materials
            for (let i = 0; i < obj.children.length; i++) {
                if (obj.children[i].material.map) {
                    let repeat = 1;
                    if (obj.children[i].material.name === "Material") {
                        repeat = 10;
                    } else if (obj.children[i].material.name === "Floor") {
                        repeat = 6;
                    } else if (obj.children[i].material.name === "Silver") {
                        //                           obj.children[i].material.envMap = "Hello";
                    };
                    obj.children[i].material.map.repeat = {
                        x: repeat,
                        y: repeat
                    };
                }
                //                    console.log(obj.children[i].material);
            }




            //useful for parsing for elements

            // Grab the animations array
            //            let animNode = obj.animations;
            //            console.log(animNode);

            /*let list = document.getElementById('controls');
            let item = list.getElementsByTagName("li");*/

            // Parse the array for animation segments
            /*let i = 0;
            obj.animations.forEach(function(node){
                item[i].innerHTML=node.name;
                i++;
            })*/
        })
    }
})

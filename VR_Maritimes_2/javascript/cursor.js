AFRAME.registerComponent('clickme', {
    init: function () {
        var lastIndex = -1;
        var COLORS = ['purple', 'green', 'blue'];
        this.el.addEventListener('click', function (evt) {
            lastIndex = (lastIndex + 1) % COLORS.length;
            this.setAttribute('material', 'color', COLORS[lastIndex]);
//            console.log('I was clicked at: ', evt.detail.intersection.point);
            console.log(evt.currentTarget.id);
        });
    }
});

function hidePlay(){
    
    //hide button and colour screen
    console.log("Play sound and hide me!");
    document.getElementById("begin").style.display = "none";
//    document.getElementById("begin").style.visibility="hidden";
    
    // Bring scene back into frame
    document.getElementById("scene").style.visibility="visible";
    document.body.style.backgroundColor= "#292929";
    var sound1 = document.querySelector('#oceanSound');
    var sound2 = document.querySelector('#buoySound');
    var sound3 = document.querySelector('#gullSound');
    sound1.components.sound.playSound();
    sound2.components.sound.playSound();
    sound3.components.sound.playSound();
}

AFRAME.registerComponent('flatshader',{
    init: function(){
        const el = this.el;
        this.el.addEventListener('model-loaded',()=>{
            let mesh = this.el.getObject3D('mesh');
            mesh.children[0].material = new THREE.MeshBasicMaterial({map: mesh.children[0].material.map});
//            mesh.children[0].material.color = new THREE.Color(0xffffff);
            console.log("Object is", mesh);
        })
    }
})

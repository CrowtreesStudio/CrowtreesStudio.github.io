//https://medium.com/chialab-open-source/how-to-handle-click-events-on-ar-js-58fcacb77c4
AFRAME.registerComponent('markerhandler', {

    init: function() {
        const animatedMarker = document.querySelector("#marker");
        const aEntity = document.querySelector("#animated-model");

        // every click, we make our model grow in size :)
        animatedMarker.addEventListener('click', function(ev){
            console.log("ev =", ev);
            console.log("ev.detail.inter =", ev.detail.intersectedEl);
            console.log("ID of object clicked =", ev.target.id);
//            console.log("target = ", target);
            const intersectedElement = ev.detail.intersectedEl;
//            console.log(intersectedElement);
            if (aEntity && intersectedElement === aEntity) {
                const scale = aEntity.getAttribute('scale');
                Object.keys(scale).forEach((key) => scale[key] = scale[key] + 0.1);
                aEntity.setAttribute('scale', scale);
            }
        });
}});
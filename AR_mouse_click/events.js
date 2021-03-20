//https://medium.com/chialab-open-source/how-to-handle-click-events-on-ar-js-58fcacb77c4
AFRAME.registerComponent('markerhandler', {
    
    schema:{
        animatedMarker:{type:"selector", default:"#marker"}
    },

    init: function() {
//        const animatedMarker = document.querySelector("#marker");
//        const aEntity = document.querySelector("#animated-model-blue");
        
        const data = this.data;

        // every click, we make our model grow or shrink in size :)
        data.animatedMarker.addEventListener('click', function(ev){

            const intersectedElement = ev.target.id;
            
            if (intersectedElement === "animated-model-blue") {
                const scale = ev.target.getAttribute('scale');
                Object.keys(scale).forEach((key) => scale[key] = scale[key] + 0.1);
                ev.target.setAttribute('scale', scale);
            }else if (intersectedElement === "animated-model-red") {
                const scale = ev.target.getAttribute('scale');
                Object.keys(scale).forEach((key) => scale[key] = scale[key] - 0.1);
                ev.target.setAttribute('scale', scale);
            };
            
        });
}});
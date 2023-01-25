/* *************************************************************** */
/* Component to adjust apparent resolution of the screen (jaggies) */
/* *************************************************************** */
AFRAME.registerComponent('pixel-ratio', {
    schema: {
        type: 'number'
    },
    update: function() {
        this.el.sceneEl.renderer.setPixelRatio(this.data)
    }
});
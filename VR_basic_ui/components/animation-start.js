/* *********************************************************** */
/*   Component to start play animations on an entity object    */
/* *********************************************************** */
AFRAME.registerComponent('animation-start', {
    init: function(){
        let el = this.el;
        // console.log("Animation Component:", el.components);
        el.components.animation__pos.animation.play();
    }
});
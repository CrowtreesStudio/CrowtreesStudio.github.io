AFRAME.registerComponent('scenemgr', {
    init: function(){
        let el = this.el;
        console.log("Contents of Scene:", el);
        console.log("Can I get the tag:",document.getElementsByTagName("img"));
    }
});
AFRAME.registerComponent('scenemgr', {
    schema:{
        activeCamRig:{type:'selector', default:'#cameraRig'}
    },
    init: function(){
        let el = this.el;
        console.log("Contents of Scene:", el);
        console.log("Can I get the tag:",document.getElementsByTagName("img"));

        window.addEventListener('load', evt=>{
            // I'm leaving these here as a useful exploration
            console.log("Device check:", AFRAME.utils.device);
            console.log("WebXR enabled?:", AFRAME.utils.device.isWebXRAvailable);
            console.log("Is it a Browser?:", AFRAME.utils.device.isBrowserEnvironment);
            console.log("Is it a VR Display?:", AFRAME.utils.device.getVRDisplay());
            console.log("Is it iOS?:", AFRAME.utils.device.isIOS());
            console.log("Is it a HMD connected?:", AFRAME.utils.device.checkHeadsetConnected());
        });

        el.addEventListener('enter-vr', evt=>{
            console.log("entering VR mode");
            data.activeCamRig.setAttribute('movement-controls','enabled', false);
        });
        
        el.addEventListener('exit-vr', evt=>{
            data.activeCamRig.setAttribute('movement-controls','enabled', true);
        });

    }
});
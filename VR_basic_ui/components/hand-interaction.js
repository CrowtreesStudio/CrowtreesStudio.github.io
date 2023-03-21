/* *********************************************************** */
/* Component to listen for HMD controllers grabbing an entity  */
/* *********************************************************** */
AFRAME.registerComponent('hand-interaction', {
    schema:{
        sceneLocator:{type:'selector', default:'a-scene'},
        feedbackTXT:{type:'selector', default:'#feedback'}
    },
    init: function(){
    },

    play: function() {
        // console.log("Grabbing test");
        // Place grabbingtest on the RIGHT & LEFT HANDS and not on the objects as was the previous version
        // The objects should yield thier id based on what the Sphere Collider returns
        let data = this.data;
        let el = this.el;
        let sceneManager = data.sceneLocator.components.scenemgr;
        let grabIt = false;

        el.addEventListener('hover-start', function(evt) {
            console.log("Event - Hover Start");
            let target = evt.detail.target;
            data.feedbackTXT.setAttribute('value', evt.detail.hand.id);
            if(target.components.animation__pos && !grabIt){
                target.components.animation__pos.animation.pause();
                target.object3D.el.setAttribute('color', '#'+(Math.random()*0xFFFFFF<<0).toString(16));
            }else{
                console.log("No animations");
            }
        });

        el.addEventListener('hover-end', function(evt) {
            console.log("Event - Hover End");
            let target = evt.detail.target;
            if(target.components.animation__pos && !grabIt){
                data.feedbackTXT.setAttribute('value', evt.detail.hand.id);
                target.components.animation__pos.animation.play();
            }else{
                console.log("No animations");
            }
        });

        el.addEventListener('grab-start', function(evt) {
            let target = evt.detail.target;
            data.feedbackTXT.setAttribute('value', evt.detail.hand.id);
            grabIt = true;
            console.log("Event Grab Start",target);
        });

        el.addEventListener('grab-end', function(evt) {
            data.feedbackTXT.setAttribute('value', evt.detail.target.id);

            evt.detail.target.object3D.el.setAttribute('color', '#'+(Math.random()*0xFFFFFF<<0).toString(16));
            sceneManager.collectorMgmt(evt.detail.target);

            evt.preventDefault();// not sure what this does yet
            console.log("Event Grab End",evt.detail);
        });
    }
  })
// Define a few custom components useful for AR mode. While these are somewhat reusable,
      // I recommend checking if there are officially supported alternatives before copying
      // these into new projects.
    
      // See also https://github.com/aframevr/aframe/pull/4356
      // AFRAME.registerComponent('hide-in-ar-mode', {
      //   // Set this object invisible while in AR mode.
      //   init: function () {
      //     this.el.sceneEl.addEventListener('enter-vr', (ev) => {
      //       this.wasVisible = this.el.getAttribute('visible');
      //       if (this.el.sceneEl.is('ar-mode')) {
      //         this.el.setAttribute('visible', false);
      //       }
      //     });
      //     this.el.sceneEl.addEventListener('exit-vr', (ev) => {
      //       if (this.wasVisible) this.el.setAttribute('visible', true);
      //     });
      //   }
      // });

      AFRAME.registerComponent('follow-shadow', {
        schema: {type: 'selector'},
        init() {this.el.object3D.renderOrder = -1;},
        tick() { 
          if (this.data) {
            this.el.object3D.position.copy(this.data.object3D.position); 
            this.el.object3D.position.y-=0.001; // stop z-fighting
          }
        }
      });
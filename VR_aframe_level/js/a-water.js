/**
 * Flat-shaded water primitive.
 *
 * The original a-ocean extra is based on a Codrops tutorial:
 * http://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/
 * The ocean primitive is contained in the A-Frame Extras component by Micah Blumberg :
 * https://github.com/n5ro/aframe-extras
 * This a-water component is based on a updated and modified version of a-ocean by James Stuart Allan March 1st, 2022
 */

AFRAME.registerPrimitive('a-water', {
  defaultComponents: {
    ocean: {},
    rotation: {x: -90, y: 0, z: 0}
  },
  mappings: {
    width: 'water.width',
    depth: 'water.depth',
    density: 'water.density',
    wavelength: 'water.wavelength',
    amplitude: 'water.amplitude',
    speed: 'water.speed',
    noise: 'water.noise',
    color: 'water.color',
    opacity: 'water.opacity'
  }
});

AFRAME.registerComponent('water', {
  schema: {
    // Dimensions of water mesh.
    width: {default: 10, min: 0},
    depth: {default: 10, min: 0},

    // Density of water mesh.
    density: {default: 2},

    // wavelength
    wavelength: {default:0.5},

    // Wave amplitude and variance.
    amplitude: {default: 3.0},

    // Wave speed and variance.
    speed: {default: 2.5},

    // surface noise
    noise: {default: 6},

    // Material.
    color: {default: '#7AD2F7', type: 'color'},
    opacity: {default: 0.8}
  },

  /**
   * Use play() instead of init(), because component mappings – unavailable as dependencies – are
   * not guaranteed to have parsed when this component is initialized.
   */
  play: function () {
    const el = this.el,
        data = this.data;
    let material = el.components.material;

    const geometry = new THREE.PlaneGeometry(data.width, data.depth, data.density, data.density);
    const posAttribute = geometry.getAttribute( 'position' );

    this.wavelets =[];

    for (let v, i=0; i<posAttribute.count; i++){
        this.wavelets.push({
          ang: Math.random() * Math.PI * 2,
        });
    };

    if (!material) {
      material = {};
      material.material = new THREE.MeshPhongMaterial({
        color: data.color,
        transparent: data.opacity < 1,
        opacity: data.opacity,
        flatShading: true,
        shininess: 100,
        side: THREE.FrontSide
      });
    }

    this.mesh = new THREE.Mesh(geometry, material.material);
    el.setObject3D('mesh', this.mesh);
    console.log("mesh", this.mesh);
  },

  remove: function () {
    this.el.removeObject3D('mesh');
  },

  tick: function (t, dt) {// time, delta time
    if (!dt) return;
    const data = this.data;
    const verts = this.mesh.geometry.getAttribute("position");

    for (let value, vprops, i = 0; i<verts.count; i++){

      var timeElapsed = t/1000;// convert to A-Frame time :)

      /* assign values to variables */
      vprops = this.wavelets[i];

      value = (data.amplitude/10) * Math.cos((verts.getY(i)*data.wavelength)-(timeElapsed*data.speed));
      value += (data.noise/30)*Math.sin((vprops.ang+verts.getY(i)) - (timeElapsed*data.speed));
      
      /* set the value for z axis */
      verts.setZ(i, value);
    }
    /* update mesh to show changes to vertex position attribute */
    verts.needsUpdate = true;
  }
});

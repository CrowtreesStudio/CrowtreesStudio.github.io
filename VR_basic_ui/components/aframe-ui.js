
AFRAME.registerComponent('aframe-ui', {
    schema:{
        size:{type:'vec2', default:{x:0.5, y:0.5}},
        padding: {default: 0.1, min: 0.01},
        texture:{type:'map', default:'assets/ui/tooltip.png'},
        color:{type:'color', default: '#000'},
        opacity:{default: 1.0, min: 0, max: 1},
        transparent:{type:'boolean', default: true},
        debug:{type:'boolean', default: false}
    },

    init: function(){
        let el = this.el;
        let data = this.data;

        
        let geometry = new THREE.PlaneBufferGeometry(data.size.x, data.size.y, 3, 3);
        
        var texture = new THREE.TextureLoader().load(data.texture); // remove color = ...
        // console.log("texture",texture);

        let geoMat = new THREE.MeshBasicMaterial({
            color: data.color,
            side: THREE.SingleSide,
            opacity: data.opacity,
            transparent: data.transparent,
            wireframe:data.debug,
            map: texture // texture as a map for material
            });

        let mesh = new THREE.Mesh(geometry, geoMat);
        el.setObject3D('mesh', mesh);

        let pos = mesh.geometry.attributes.position.array;
        // console.log("Looking For pos:", mesh.geometry.attributes.position.array);

        // console.log("Looking For UVs:", mesh.geometry.attributes.uv.array);
        var uvs = mesh.geometry.attributes.uv.array;

        // Taken from Nine Slice component
        function setPos(id, x, y) {
            pos[3 * id] = x;
            pos[3 * id + 1] = y;
          }

        function setUV (id, u, v) {
            uvs[2 * id] = u;
            uvs[2 * id + 1] = v;
          }

          // 0---1------------2--3      ! 0 u=0, v=1
          // |   |            |  |      ! 1 u=0.333, v=1
          // 4---5------------6--7
          // |   |            |  |
          // |   |            |  |
          // |   |            |  |
          // 8---9------------10-11
          // |   |            |  |
          // 12-13------------14-15

        setUV(0,  0, 1);
        setUV(1,  0.6666, 1);
        setUV(2,  0.3333, 1);
        setUV(3,  1, 1);
        
        setUV(4, 0, 0.3333);
        setUV(5, 0.6666, .3333);
        setUV(6, 0.3333, .3333);
        setUV(7, 1, .3333);

        setUV(8,  0, .6666);
        setUV(9,  0.6666, 0.6666);
        setUV(10,  0.3333, 0.6666);
        setUV(11,  1, 0.6666);

        setUV(12,  0, 0);
        setUV(13,  0.6666, 0);
        setUV(14,  0.3333, 0);
        setUV(15,  1, 0);

        // Update vertex positions
        // console.log("size:", data.size);
	    var w2 = data.size.x / 2;
	    var h2 = data.size.y / 2;
	    var left = -w2 + data.padding;
	    var right = w2 - data.padding;
	    var top = h2 - data.padding;
	    var bottom = -h2 + data.padding;
        // console.log("bottom:", bottom," top:",top);

	    setPos(0, -w2,    h2);
	    setPos(1, left,   h2);
	    setPos(2, right,  h2);
	    setPos(3, w2,     h2);

	    setPos(4, -w2,    top);
	    setPos(5, left,   top);
	    setPos(6, right,  top);
	    setPos(7, w2,     top);

	    setPos(8, -w2,    bottom);
	    setPos(9, left,   bottom);
	    setPos(10, right, bottom);
	    setPos(11, w2,    bottom);

	    setPos(13, left,  -h2);
	    setPos(14, right, -h2);
	    setPos(12, -w2,   -h2);
	    setPos(15, w2,    -h2);

	    // this.geometry.attributes.position.needsUpdate = true;
	    // this.geometry.attributes.uv.needsUpdate = true;

    }
})
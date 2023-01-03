
AFRAME.registerComponent('aframe-ui', {
    schema:{
        size:{type:'vec3', default:{x:0.5, y:0.5, z:0.5}},
        color:{type:'color', default: '#000'},
        texture:{type:'map', default:'assets/ui/tooltip.png'},
        opacity:{default: 1.0, min: 0, max: 1},
        transparent:{type:'boolean', default: true},
        debug:{type:'boolean', default: false}
    },

    init: function(){
        let el = this.el;
        let data = this.data;

        
        let geoMesh = new THREE.PlaneBufferGeometry(data.size.x, data.size.y, 3, 3);
        
        var texture = new THREE.TextureLoader().load(data.texture); // remove color = ...
        console.log("texture",texture);

        let geoMat = new THREE.MeshBasicMaterial({
            color: data.color,
            side: THREE.SingleSide,
            opacity: data.opacity,
            transparent: data.transparent,
            wireframe:data.debug,
            map: texture // texture as a map for material
            });

        let mesh = new THREE.Mesh(geoMesh, geoMat);
        el.setObject3D('mesh', mesh);

        console.log("Looking For UVs:", mesh.geometry.attributes.uv.array);
        var uvs = mesh.geometry.attributes.uv.array;

        // Taken from Nine Slice component
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
        setUV(1,  0.7, 1);
        setUV(2,  0.3, 1);
        setUV(3,  1, 1);
        
        setUV(4, 0, 0.3);
        setUV(5, 0.7, .3);
        setUV(6, 0.3, .3);
        setUV(7, 1, .3);

        setUV(8,  0, .75);
        setUV(9,  0.7, 0.75);
        setUV(10,  0.3, 0.75);
        setUV(11,  1, 0.75);

        setUV(12,  0, 0);
        setUV(13,  0.7, 0);
        setUV(14,  0.3, 0);
        setUV(15,  1, 0);

        geoMat = new THREE.MeshBasicMaterial({
            color: '#fff',
            side: THREE.SingleSide,
            wireframe:true,
            });

        mesh = new THREE.Mesh(geoMesh, geoMat);
        el.setObject3D('mesh2', mesh);

    }
})
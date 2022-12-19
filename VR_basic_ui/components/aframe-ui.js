
AFRAME.registerPrimitive('a-user-interface', {
    defaultComponents: {
        interface:{}
    },
    mappings: {
        fieldsize: 'interface.fieldDim',
        bordersize: 'interface.fieldBorderDim',
        fieldcolor: 'interface.fieldMatBkgd',
        bordercolor: 'interface.fieldMatBorder'
    }
  });

AFRAME.registerComponent('interface', {
    schema:{
        fieldDim:{type:'vec3', default:{x:1, y:1, z:0.01}},
        fieldBorderDim:{type:'number', default:0.1},
        fieldMatBkgd:{type:'color', default: '#888888'},
        fieldMatBorder:{type:'color', default: '#555555'}
    },

    init: function(){
        console.log("set up ui frame");
        let el = this.el;
        let data = this.data;

        // UI Field
        console.log("Data:", data.fieldDim.x);
        let geoMesh = new THREE.BoxBufferGeometry(data.fieldDim.x, data.fieldDim.y, data.fieldDim.z);
        let geoMat = new THREE.MeshStandardMaterial({color:data.fieldMatBkgd});
        let mesh = new THREE.Mesh(geoMesh, geoMat);
        mesh.material.shadowSide = 2;
        el.setObject3D('mesh', mesh);
        mesh.castShadow=true;
        mesh.material.shadowSide=1;
        // UI Border
        geoMesh = new THREE.BoxBufferGeometry(data.fieldDim.x+data.fieldBorderDim, data.fieldDim.y+data.fieldBorderDim, data.fieldDim.z);
        geoMat = new THREE.MeshStandardMaterial({color:data.fieldMatBorder});
        mesh2 = new THREE.Mesh(geoMesh, geoMat);
        el.setObject3D('mesh2', mesh2);
        mesh2.castShadow=true;
        mesh2.material.shadowSide=1;
        let zOffSet = -1;
        mesh2.position.z = data.fieldDim.z*zOffSet;
        console.log("Object",el.getObject3D('mesh'));
    }
})
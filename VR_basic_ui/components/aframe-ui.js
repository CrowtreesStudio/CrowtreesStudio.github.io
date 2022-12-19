
AFRAME.registerComponent('aframe-ui', {
    schema:{
        boxDim:{type:'vec3', default:{x:1, y:1, z:1}},
        boxMatBkgd:{type:'color', default: '#888888'},
        boxMatBorder:{type:'color', default: '#555555'}
    },

    init: function(){
        let el = this.el;
        let data = this.data;
        let geoMesh = new THREE.BoxBufferGeometry(data.boxDim.x, data.boxDim.y, data.boxDim.z);
        let geoMat = new THREE.MeshStandardMaterial({color:data.boxMatBkgd});
        let mesh = new THREE.Mesh(geoMesh, geoMat);
        el.setObject3D('mesh', mesh);

        geoMesh = new THREE.BoxBufferGeometry(data.boxDim.x, data.boxDim.y, data.boxDim.z);
        geoMat = new THREE.MeshStandardMaterial({color:data.boxMatBorder});
        mesh2 = new THREE.Mesh(geoMesh, geoMat);
        el.setObject3D('mesh2', mesh2);
        let zOffSet = -1;
        console.log("offset challenge:", (data.boxDim.x/100)*10);
        mesh2.position.z = data.boxDim.z*zOffSet;
        let width = data.boxDim.x;
        mesh2.scale.x = 1+(0.003*10);
        mesh2.scale.y = 1+(0.004*10);
        console.log("Object",el.getObject3D('mesh'));
        // take smallest value (dim width or height) and determine 10% (unit value) then add that to both width & height
    }
})
window.onload = function(){
    init();
}


var scene, camera, renderer;// basic requirements for three.js project
var arToolkitSource, arToolkitContext;
var texture, markerBase, markerControls;
var agent, ghost, background;// models

function init(){
    scene = new THREE.Scene();
    camera = new THREE.Camera();

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true // removes background for video pass through
    });

    let ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
    scene.add( ambientLight );


    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    texture = new THREE.TextureLoader().load('textures/custom_uv_diag.png');
    
    // add Model (box primiative)
    var cube = buildBoxModel();
    cube.position.y = -0.5;
    
    // build a hider
    var ghost = buildGhostModel();
    ghost.position.y = -0.5;
    
    var loader = new THREE.ColladaLoader();
    loader.options.convertUpAxis = true;
    loader.load('assets/models/agent.dae', function(collada) {


        var dae = collada.scene;
        /*dae.traverse(function(child) {

            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }

        });*/
        dae.rotation.x = -Math.PI/2;
        dae.updateMatrix();
        prepModels(dae);
    });
    
    
    
    


    ////////////////////////////////////////////////////////////
    // setup arToolkitSource
    ////////////////////////////////////////////////////////////

    arToolkitSource = new THREEx.ArToolkitSource({
        sourceType : 'webcam',
    });

    function onResize()
    {
        arToolkitSource.onResize()	
        arToolkitSource.copySizeTo(renderer.domElement)	
        if ( arToolkitContext.arController !== null )
        {
            arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)	
        }	
    }

    arToolkitSource.init(function onReady(){
        onResize()
    });

    // handle resize event
    window.addEventListener('resize', function(){
        onResize()
    });

    ////////////////////////////////////////////////////////////
    // setup arToolkitContext
    ////////////////////////////////////////////////////////////	

    // create atToolkitContext
    arToolkitContext = new THREEx.ArToolkitContext({
        cameraParametersUrl: 'data/camera_para.dat',
        detectionMode: 'mono'
    });

    // copy projection matrix to camera when initialization complete
    arToolkitContext.init( function onCompleted(){
        camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
    });

    ////////////////////////////////////////////////////////////
    // setup Marker Controls
    ////////////////////////////////////////////////////////////
    // build markerControls
    markerBase = new THREE.Group();
    scene.add(markerBase);
    markerControls = new THREEx.ArMarkerControls(arToolkitContext, markerBase, {
        type: 'pattern', patternUrl: "data/hiro.patt",
    })


//            markerBase.add( cube );
//            markerBase.add( ghost );

    renderLoop();
}


function update(){
    // update artoolkit on every frame
    if ( arToolkitSource.ready !== false )
        arToolkitContext.update( arToolkitSource.domElement );
}

function render() {
    renderer.render(scene, camera);
};


function renderLoop(){
    requestAnimationFrame(renderLoop);
    update();
    render();
}


//////////////////////////////////////
/*          Build Models            */
//////////////////////////////////////
function buildBoxModel(){
    var geometry = new THREE.BoxGeometry(2, 2, 2);
    var material = new THREE.MeshPhongMaterial({
        color: 0xFFFFFF,
        wireframe: false,
        transparent: true,
//                opacity: 0.5,
        side: THREE.BackSide,
        map: texture
    });
    return new THREE.Mesh(geometry, material);
}

function buildGhostModel(){
    var geometry = new THREE.BoxGeometry(2.02, 2.02, 2.02);
    geometry.faces.splice(4, 2);
    var material = new THREE.MeshBasicMaterial({
        colorWrite: false
    });
    return new THREE.Mesh(geometry, material);
}


function prepModels(sceneModel){
    markerBase.add(sceneModel);
    
    agent = scene.getObjectByName("agent", true);
    agent.children[0].material[0].transparent = true;
    agent.children[0].material[1].transparent = true;
    agent.children[0].material[2].transparent = true;
    agent.children[0].material[3].transparent = true;
    agent.children[0].material[4].transparent = true;
    agent.children[0].material[5].transparent = true;

    background = scene.getObjectByName("background", true);
    background.children[0].material.transparent = true;

    
    ghost = scene.getObjectByName("ghost", true);
    ghost.children[0].material = new THREE.MeshBasicMaterial({
        colorWrite: false
    });
        
}
/**
    Author: Hitarth Singh & Kerim Kochekov
    Project: Museum Imaginarium
    Description: This is the main JS file for the game
*/

"use strict"; //To use the strict mode of JS.

// Global variables
var canvas, renderer, scene, camera, controls, room, points, player; 
var raycaster, pointer, drop_sphere; 
var cameraLight, pointLight, ambientLight, spotLightList;

spotLightList = [];
var CM = 100; // CM is unit equal to 100 pixels. Basically it can be used for scaling the whole scene

var ROOM_WIDTH = 60;
var ROOM_HEIGHT = 20;
var ROOM_LENGTH = 80;
var PLAYER_HEIGHT = 10;
var CAMERA_START_POINT =  [ROOM_WIDTH/2 - 1, -ROOM_HEIGHT/2 + PLAYER_HEIGHT, 1.5*ROOM_LENGTH ];
var START_CORNER = [ROOM_WIDTH/2, -ROOM_HEIGHT/2, ROOM_LENGTH];
var INTIAL_DROP_POINT = CAMERA_START_POINT;

function onPointerMove( event ) {
	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

window.addEventListener('pointermove', onPointerMove );
function findGetParameter(parameterName) {
    var result = null,
    tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}

var query;
function init() {
    query = findGetParameter("name");
    if (query == ""){
        query = "cats";
    }
    try {
        canvas = document.getElementById("mainCanvas");
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: false,
            alpha: true,
        });
    }
    catch(e) {
        document.getElementById("error").innerHTML = "<h1>Sorry, the browser doesn't support WebGL. Please try with a newer and better browser!";
        return;
    }

    points = [];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    renderer.setSize( window.innerWidth, window.innerHeight );
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    createScene();
    
    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();

    addTrackballControls();

    var ambient = new THREE.AmbientLight(0x444444)
    scene.add(ambient);
    
    animate();

}

function getSpotLight(position, targetObject = null){
    var spotLight = new THREE.SpotLight(0xffffff);
    set_position(spotLight, position);
    spotLight.castShadow = true;

    if (targetObject)
        spotLight.target = targetObject;

    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;

    return spotLight;
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function add_point(){
    var geometry = new THREE.SphereGeometry(1);
    var material = new THREE.MeshBasicMaterial( { color: 0xf8f8f8, opacity: 0.9, transparent: true} );
    var sphere = new THREE.Mesh(geometry, material);
    points.push(sphere);
    return sphere;
}

var grass;
var photoframes;
var images;

/**
 * Function to create the scene. It is called just once to make the scene.
 */
function createScene(){
    const loader = new THREE.TextureLoader();
    const background_loader = new THREE.CubeTextureLoader();
    const texture = background_loader.load([
        './assets/football/posx.jpg',
        './assets/football/negx.jpg',
        './assets/football/posy.jpg',
        './assets/football/negy.jpg',
        './assets/football/posz.jpg',
        './assets/football/negz.jpg',
    ]);

    scene.background = texture;
    room = new Room(ROOM_LENGTH, ROOM_HEIGHT, ROOM_WIDTH);
    scene.add(room.object);
    player = new Player(camera, room);
    
    drop_sphere = add_point(); // for showing a drop at the location of mouse
    set_position(drop_sphere, INTIAL_DROP_POINT);
    set_position(camera, CAMERA_START_POINT);
    
    // Lets add some spot lights for each object in the room
    for (var deco in room.decorations){
        if (deco == "Bonsai" || deco == "Light")
            continue;
        var ob = room.decorations[deco];
        var light_position = [...ob.position]; // copy the posiiton
        light_position[1] = ROOM_HEIGHT - 11;
        if (deco == "Bench"){
            light_position[1] -= 3.9;
            light_position[2] += 3;
        }

        var lightSphere = add_point();
        set_position(lightSphere, light_position);
        scene.add(lightSphere);

        var spotLight = getSpotLight(light_position);
        spotLight.intensity = 2;
        spotLightList.push(spotLight);
        scene.add(spotLight);
    }
    var pointLight1 = new THREE.PointLight(0xffffff, 1, 100);
    var pos = [ROOM_WIDTH/4, ROOM_HEIGHT - 5, ROOM_LENGTH/2];
    set_position(pointLight1, pos);
    pointLight1.intensity = 10;
    scene.add(pointLight1);

    // Let's add the PhotoFrames!
    images = []; // list of 5 images {width: xx, height: xx, url: xx}
    getData(query);
    
    if (queryData.total == 0){
        window.alert("No Image Found! Please try again!");
        window.location.href = "home.html"
        return;
    }
    for (var i = 0; i < 5; i++){
        var im = queryData.hits[i];
        images.push({
                width: im.imageWidth,
                height: im.imageHeight,
                url: im.webformatURL
            });
    }
    
    photoframes = { 
        Frame0:{
                "width": images[4].width,
                "height": images[4].height,
                "desired_width": 10,
                "desired_height": 15,
                "position": [-10,0,2],
                "rotation": [0,0,0],
                "url": images[4].url,
                "Object": null
        },
        Frame1:{
                "width": images[0].width,
                "height": images[0].height,
                "desired_width": 10,
                "desired_height": 15,
                "position": [12,0,2],
                "rotation": [0,0,0],
                "url": images[0].url,
                "Object": null
        },
        Frame2:{
                "width": images[1].width,
                "height": images[1].height,
                "desired_width": 30,
                "desired_height": 15,
                "position": [-ROOM_WIDTH/2 + 2,0,ROOM_LENGTH*0.35],
                "rotation": [0,Math.PI/2,0],
                "url": images[1].url,
                "Object": null
        },
        Frame3:{
                "width": images[2].width,
                "height": images[2].height,
                "desired_width": 40,
                "desired_height": 15,
                "position": [-ROOM_WIDTH/2 + 2,0,ROOM_LENGTH*0.75],
                "rotation": [0,Math.PI/2,0],
                "url": images[2].url,
                "Object": null
        },
        Frame4:{
                "width": images[3].width,
                "height": images[3].height,
                "desired_width": 40,
                "desired_height": 15,
                "position": [ROOM_WIDTH/2 - 1,0,ROOM_LENGTH/2],
                "rotation":  [0,Math.PI/2,0],
                "url": images[3].url,
                "Object": null
        },
        Guide:{
            "width": 330,
            "height": 205,
            "desired_width": 10,
            "desired_height": 5,
            "position": [15,0,110],
            "rotation": [0,Math.PI/4,0],
            "url": '../assets/guide.png',
            "Object": null
        }
    }
    
    for (var ph_name in photoframes){
        var ph = photoframes[ph_name];
        var ratio = Math.max(ph.width / ph.desired_width, ph.height / ph.desired_height);
        var ph_ob = new PhotoFrame(ph.width / ratio, ph.height / ratio, ph.position, ph.rotation, ph.url);
        ph.Object = ph_ob;
        scene.add(ph_ob.object);
    }

    window.addEventListener(
        "keydown", (event) => {
            if (event.isComposing || event.keyCode === 82) {
                window.location.href = "index.html";
                return;
            }
            if (event.isComposing || event.keyCode === 37) {
                player.rotate_y(true);
                return;
            }
            if (event.isComposing || event.keyCode === 38) {
                player.move_forward(true);
                return;
            }
            if (event.isComposing || event.keyCode === 39) {
                player.rotate_y(true, -1);
                return;
            }
            if (event.isComposing || event.keyCode === 40) {
                player.move_forward(true, -1);
                return;
            }
            if (event.isComposing || event.keyCode === 85) {
                player.rotate_up(true, 1);
                return;
            }
            if (event.isComposing || event.keyCode === 74) {
                player.rotate_up(true, -1);
                return;
            }         
        }
    );
    
    window.addEventListener(
    "keyup", (event) => {
            if (event.isComposing || event.keyCode === 37) {
                player.rotate_y(false);
                return;
            }
            if (event.isComposing || event.keyCode === 38) {
                player.move_forward(false);
                return;
            }
            if (event.isComposing || event.keyCode === 39) {
                player.rotate_y(false);
                return;
            }
            if (event.isComposing || event.keyCode === 40) {
                player.move_forward(false);
                return;
            }
            if (event.isComposing || event.keyCode === 85) {
                player.rotate_up(false);
                return;
            }
            if (event.isComposing || event.keyCode === 74) {
                player.rotate_up(false);
                return;
            }
        }
    );
}

// Function to Render the scene
function render(){
    player.step();
    raycaster.setFromCamera( pointer, camera );
    var obs = raycaster.intersectObject(room.walls["Ground"].Wall.object);
    if (obs.length > 0){
        var drop_point = obs[0].point;
        set_position(drop_sphere, [drop_point.x, drop_point.y, drop_point.z]);
    }
    renderer.render(scene, camera);
}

//Function to add trackball controls to move with Mouse
function addTrackballControls(){
    controls = new THREE.TrackballControls(camera, canvas);
    controls.noZoom = false;
    controls.noPan = controls.staticMoving = true;
    function move() {
        controls.update();
        render();
    }
    function down() {
        document.addEventListener("mousemove", move, false);
    }
    function up() {
        document.removeEventListener("mousemove", move, false);
    }
    function touch(event) {
        if (event.touches.length == 1) {
            move();
        }
    }
    canvas.addEventListener("mousedown", down, false);
    canvas.addEventListener("touchmove", touch, false);   
}



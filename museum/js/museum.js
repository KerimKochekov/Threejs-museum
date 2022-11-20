/**
    Author: Hitarth Singh & Kerim Kochekov
    Project: Museum Imaginarium
    Description: This is the main JS file for the game
*/

"use strict"; //To use the strict mode of JS.

var canvas, renderer, scene, camera, controls, room, points, player; //Global Variables for rendering

var raycaster, pointer, drop_sphere; 

var cameraLight, pointLight, ambientLight, spotLight;

var CM = 100; // CM is unit equal to 100 pixels. Basically it can be used for scaling the whole scene


var ROOM_WIDTH = 60;
var ROOM_HEIGHT = 20;
var ROOM_LENGTH = 80;
var PLAYER_HEIGHT = 5;
var CAMERA_START_POINT =  [ROOM_WIDTH/2 - 1, -ROOM_HEIGHT/2 + PLAYER_HEIGHT, ROOM_LENGTH - 5];
var START_CORNER = [ROOM_WIDTH/2, -ROOM_HEIGHT/2, ROOM_LENGTH];
//[ROOM_WIDTH, -ROOM_HEIGHT+ PLAYER_HEIGHT , -ROOM_LENGTH/2 + 10];


var INTIAL_DROP_POINT = CAMERA_START_POINT;

function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

window.addEventListener( 'pointermove', onPointerMove );
    
function init() {
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

    

//    
    
    var ambient = new THREE.AmbientLight(0x444444)
    scene.add(ambient);
    
//    points.push(add_point([0,0,0]));
    
    animate();

}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function add_point(pos){
    var geometry = new THREE.SphereGeometry(1);
    var material = new THREE.MeshBasicMaterial( { color: 0xf8f8f8, opacity: 0.7, transparent: true} );
    var sphere = new THREE.Mesh( geometry, material );
    set_position(sphere, pos);
    return sphere;
}

var grass;
/**
 * Function to create the scene. It is called just once to make the scene.
 */
function createScene(){
    // renderer.setClearColorHex( 0xff0000, 0);
    const loader = new THREE.TextureLoader();
    room = new Room(ROOM_LENGTH, ROOM_HEIGHT, ROOM_WIDTH);
    scene.add(room.object);
    player = new Player(camera, room);
    
    
    drop_sphere = add_point([-1,-1,10]); // for showing a drop at the location of mouse
    set_position(drop_sphere, INTIAL_DROP_POINT);
    set_position(camera, CAMERA_START_POINT);
    scene.add(drop_sphere);
    
    var start_sphere = add_point(START_CORNER);
    scene.add(start_sphere);


//    scene.add(player.arrow_object);
    window.addEventListener(
        "keydown", (event) => {
//            console.log(event.keyCode);
            if (event.isComposing || event.keyCode === 37) {
//                console.log("Left Key");
                player.rotate_y(true);
                return;
            }
            if (event.isComposing || event.keyCode === 38) {
//                console.log("Up Key");
                player.move_forward(true);
            return;
            }
            if (event.isComposing || event.keyCode === 39) {
//                console.log("Right Key");
                player.rotate_y(true, -1);
                return;
            }
            if (event.isComposing || event.keyCode === 40) {
//                console.log("Down Key");
                player.move_forward(true, -1);
                return;
            }
    }
    );
    
    window.addEventListener(
    "keyup", (event) => {
//            console.log(event.keyCode);
            if (event.isComposing || event.keyCode === 37) {
//                console.log("Left Key");
                player.rotate_y(false);
                return;
            }
            if (event.isComposing || event.keyCode === 38) {
                console.log("Up Key Release");
                player.move_forward(false);
//                player.move_forward(1);
            return;
            }
            if (event.isComposing || event.keyCode === 39) {
//                console.log("Right Key");
                player.rotate_y(false);
                return;
            }
            if (event.isComposing || event.keyCode === 40) {
//                console.log("Down Key");
                player.move_forward(false);
                return;
            }
    });
    
    
}

/**
 * Function to Render the scene
 **/
function render(){
    
    // scene.background = new THREE.Color( 0x87CEEB );
    // camera.rotation.y += 0.01;
    player.step();
 
    raycaster.setFromCamera( pointer, camera );
    var obs = raycaster.intersectObject(room.walls["Ground"].Wall.object);
    if (obs.length > 0){
        
        var drop_point = obs[0].point;
        set_position(drop_sphere, [drop_point.x, drop_point.y, drop_point.z]);
//        console.log(drop_point);
    }
//    
//    
    renderer.render(scene, camera);
}

/**
 * Function to add trackball controls to move with Mouse
 */
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



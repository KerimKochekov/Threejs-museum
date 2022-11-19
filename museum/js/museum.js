/**
    Author: Hitarth Singh & Kerim Kochekov
    Project: Museum Imaginarium
    Description: This is the main JS file for the game
*/

"use strict"; //To use the strict mode of JS.

var canvas, renderer, scene, camera, controls, room, points, player;  //Global Variables for rendering
var cameraLight, pointLight, ambientLight, spotLight;

var CM = 100; // CM is unit equal to 100 pixels. Basically it can be used for scaling the whole scene

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
    camera.position.z = 5;
    
    addTrackballControls();
    
    
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
    var geometry = new THREE.SphereGeometry(0.1);
    var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    var sphere = new THREE.Mesh( geometry, material );
    set_position(sphere, pos);
    scene.add( sphere );
    return sphere;
}

/**
 * Function to create the scene. It is called just once to make the scene.
 */
function createScene(){
    // renderer.setClearColorHex( 0xff0000, 0);
    room = new Room(5,5,5 );
    scene.add(room.object);
    player = new Player(camera, room);
    // scene.add(wall.object);
}

/**
 * Function to Render the scene
 **/
function render(){
    // scene.background = new THREE.Color( 0x87CEEB );
    // camera.rotation.y += 0.01;
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


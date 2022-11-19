/**
    Author: Hitarth Singh & Kerim Kochekov
    Project: Museum Imaginarium
    Description: Class for Player
*/

"use strict"; //To use the strict mode of JS.


class Player {
    constructor(camera, room){
        this.camera = camera;
        this.room = room;
        this.arrow_object = new THREE.ArrowHelper();
        this.rotate_y(0); // to get this.forward updated
        this.arrow_length = 1;
        this.arrow_hex = 0xffff00;
        var origin = new THREE.Vector3();
        origin.copy(camera.position);
        }
    
    update_arrow(){
        var origin = new THREE.Vector3();
        origin.copy(camera.position);
        this.arrow_object.dir = this.forward;
        this.arrow_object.origin = origin;
    }

    rotate_y(delta){
        camera.rotation.y += delta;
        this.forward = new THREE.Vector3( 0, 0, - 1 );
        var axis = new THREE.Vector3( 0, 1, 0 );
        var angle = camera.rotation.y;
        this.forward.applyAxisAngle(axis, angle);
        this.update_arrow();
    }
    
    move_forward(delta){
     camera.position.add(this.forward.multiplyScalar(delta));
    }
}
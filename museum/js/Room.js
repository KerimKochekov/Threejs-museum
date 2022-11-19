/**
    Author: Hitarth Singh & Kerim Kochekov
    Project: Museum Imaginarium
    Description: Class for Room
*/

"use strict"; //To use the strict mode of JS.

function set_position(object, position){
    object.position.x = position[0];
    object.position.y = position[1];
    object.position.z = position[2];
}

function set_rotation(object, rotation){
    object.rotation.x = rotation[0];
    object.rotation.y = rotation[1];
    object.rotation.z = rotation[2];
}

class Wall {
    constructor(height, width, position = [0,0,0], rotation = [0,0,0], material = null){
        this.object = new THREE.Object3D();
//        const geometry = new THREE.PlaneGeometry( height, width);
        const geometry =  new THREE.BoxGeometry( width, height, 0.1);
        const loader = new THREE.TextureLoader();
        if (!material){
            material = new THREE.MeshBasicMaterial( {map: loader.load('assets/wall-texture.jpeg'), side: THREE.DoubleSide} );
        }
        this.box = new THREE.Mesh( geometry, material );
        this.object.add(this.box);
        set_rotation(this.object, rotation);
        set_position(this.object, position);
    }
    
    get_bounding_box(){
        this.box.geometry.computeBoundingBox();
        return this.box.geometry.boundingBox;
    }
}

function recompute_all_bounding_boxes(room){
    room.bounding_boxes = [];
    for (var i=0; i<room.objects.length; i++){
        room.bounding_boxes.push(room.objects[i].get_bounding_box());
    }
}

class Room {
    constructor(length, height, width){
        this.bounding_boxes = []; //stores th bounding boxes of hard objects
        this.objects = [];
        this.player = (0,0);
        this.length = length;
        this.height = height;
        this.width = width;
        this.object = new THREE.Object3D();
        
        const loader = new THREE.TextureLoader();
        var wall_material = new THREE.MeshBasicMaterial( {map: loader.load('assets/wall-texture.jpeg'), side: THREE.DoubleSide} );
        
        var floor_material = new THREE.MeshBasicMaterial( {map: loader.load('assets/floor-texture.jpeg'), side: THREE.DoubleSide} );
        
        var ceiling_material = new THREE.MeshBasicMaterial( {map: loader.load('assets/ceiling-texture.jpeg'), side: THREE.DoubleSide} );
        
        this.wall_left = new Wall(height, length, [-width/2,0,-length/2], [0, Math.PI/2, 0], wall_material);
        this.wall_right = new Wall(height, length, [0,0,0], [0,0, 0], wall_material);
        this.wall_back = new Wall(height, width,[width/2,0,-length/2], [0, -3*Math.PI/2, 0], wall_material);
        this.wall_front = new Wall(height, width, [0,0,-length], [0, 0, 0], wall_material);
        this.wall_top = new Wall(length, width, [0,height/2,-length/2], [Math.PI/2, 0, 0], ceiling_material);
    
        this.wall_bottom = new Wall(length, width, [0,-height/2,-length/2], [Math.PI/2, 0, 0], floor_material);
        
        this.objects.push(this.wall_left, this.wall_right, this.wall_top, this.wall_front, this.wall_back, this.wall_bottom);
        
        recompute_all_bounding_boxes(this);

        this.object.add(this.wall_left.object);
        this.object.add(this.wall_right.object);
        this.object.add(this.wall_front.object);
        this.object.add(this.wall_back.object);
        this.object.add(this.wall_top.object);
        this.object.add(this.wall_bottom.object);
    }

}


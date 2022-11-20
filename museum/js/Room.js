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

var DOOR_SIZE = 10;
class Wall {
    constructor(width, height, position = [0,0,0], rotation = [0,0,0], material = null, windows = null){
        this.object = new THREE.Object3D();
//        const geometry = new THREE.PlaneGeometry( height, width);
        const geometry =  new THREE.BoxGeometry( width, height, 1);
        const loader = new THREE.TextureLoader();
        if (!material){
            material = new THREE.MeshBasicMaterial( {map: loader.load('assets/wall-texture.jpeg'), side: THREE.DoubleSide} );
        }
        this.box = new THREE.Mesh(geometry, material);
        
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
        
        var grass_material = new THREE.MeshBasicMaterial( {map: loader.load('assets/grass-texture.jpeg', function ( texture ) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set( 0, 0 );
    texture.repeat.set( 4, 4 )}), side: THREE.DoubleSide} );
        
        
        this.walls = 
            {
                "Grass": {
                   "name" : "Grass",
                    "width": 100,
                    "height": 100,
                    "position": [0,-ROOM_HEIGHT/2-0.1,0],
                    "rotation": [Math.PI/2,0,0],
                    "material": grass_material,
                    "Wall": null
                },
                "Front": {
                    "name" : "Back",
                    "width": width,
                    "height": height,
                    "position": [0,0,0],
                    "rotation": [0,0,0],
                    "material": wall_material,
                    "Wall": null
                },
                
                "Back": {
                    "name" : "Front",
                    "width": width,
                    "height": height,
                    "position": [0,0,length],
                    "rotation": [0,0,0],
                    "material": wall_material,
                    "Wall": null
                }, 
                
                "Left": {
                    "name" : "Left",
                    "width": length,
                    "height": height,
                    "position": [-width/2,0,length/2],
                    "rotation": [0,Math.PI/2,0],
                    "material": wall_material,
                    "Wall": null
                    
                }, 
            
                "Middle": {
                    "name" : "Middle",
                    "width": length - DOOR_SIZE,
                    "height": height,
                    "position": [0,0,length/2],
                    "rotation": [0,Math.PI/2,0],
                    "material": wall_material,
                    "Wall": null
                    
                }, 
            
                "Right": {
                    "name" : "Right",
                    "width": length,
                    "height": height,
                    "position": [width/2,0,length/2],
                    "rotation": [0,Math.PI/2,0],
                    "material": wall_material,
                    "Wall": null
                }, 
            
            
                "Ground": {
                    "name" : "Ground",
                    "width": width,
                    "height": length,
                    "position": [0,-height/2,length/2],
                    "rotation": [Math.PI/2,0,0],
                    "material": floor_material,
                    "Wall": null
                }, 
            
//                "Ceiling": {
//                    "name" : "Ceiling",
//                    "width": width,
//                    "height": length,
//                    "position": [0,height/2,length/2],
//                    "rotation": [Math.PI/2,0,0],
//                    "material": ceiling_material,
//                    "Wall": null
//                }, 
        };
    
        for (var wall_name in this.walls){
            var wall = this.walls[wall_name];
            var wall_object = new Wall(wall.width, wall.height, wall.position, wall.rotation, wall.material);
            console.log(wall.position, wall.rotation, wall.material);
            wall.Wall = wall_object;
            this.objects.push(wall_object);
            this.object.add(wall_object.object);
        }
        
        recompute_all_bounding_boxes(this);

    }
    
    inside_solid(vec){
        for (var i =0; i < this.bounding_boxes.length; i++){
            var box = this.bounding_boxes[i];
            if (box.containsPoint(vec)){
                return true;
            }
        }
        return false;
    }
    
    ray_intersects(ray){
        for (var i =0; i < this.bounding_boxes.length; i++){
            
            var box = this.bounding_boxes[i];
            if (ray.intersectsBox(box)){
                return true;
            }
        }
        return false;
    }
    
    triangle_intersects(triangle){
        for (var i =0; i < this.bounding_boxes.length; i++){
            console.log("Checking box " + String(i));
            var box = this.bounding_boxes[i];
            if (box.intersectsTriangle(triangle)){
                return true;
            }
        }
        return false;
    }

}


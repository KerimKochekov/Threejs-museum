/**
    Author: Hitarth Singh & Kerim Kochekov
    Project: Museum Imaginarium
    Description: Class for PhotoFrame
*/

"use strict"; //To use the strict mode of JS.

class PhotoFrame {
    constructor(width, height, position = [0,0,0], rotation = [0,0,0], url){
        this.object = new THREE.Object3D();
        // Let's create the frame with wood texture
        this.frame = new THREE.Object3D();
        const loader = new THREE.TextureLoader();
        var wood_material = new THREE.MeshBasicMaterial( {map: loader.load('assets/wood-texture.jpg'), side: THREE.DoubleSide} );
        
        var frame_width = 0.3;
        var frame_thickness = 0.3;
        
        this.top_frame = new THREE.Mesh(
                new THREE.BoxGeometry( width + 2*frame_width, frame_width, frame_thickness),
                wood_material);
        this.bottom_frame = new THREE.Mesh(
                new THREE.BoxGeometry( width+2*frame_width, frame_width, frame_thickness),
                wood_material);
        
        this.left_frame = new THREE.Mesh(
                new THREE.BoxGeometry( height + 2*frame_width, frame_width, frame_thickness),
                wood_material);
        
        this.right_frame = new THREE.Mesh(
                new THREE.BoxGeometry( height + 2*frame_width, frame_width, frame_thickness),
                wood_material);
        
        this.top_frame.position.y = height/2 + frame_width/2;
        this.bottom_frame.position.y = -height/2 - frame_width/2;
        this.left_frame.rotation.z = Math.PI/2;
        this.left_frame.position.x = -width/2 - frame_width/2;
        this.right_frame.rotation.z = Math.PI/2 ;
        this.right_frame.position.x = width/2  + frame_width/2;
        
        this.frame.add(this.top_frame, this.left_frame, this.right_frame, this.bottom_frame);
        this.object.add(this.frame);
        
        const geometry =  new THREE.BoxGeometry( width, height, frame_thickness);
        var picture_material = new THREE.MeshBasicMaterial( {map: loader.load(url), side: THREE.DoubleSide} );
        this.box = new THREE.Mesh(geometry, picture_material);
        
        this.object.add(this.box);
        set_rotation(this.object, rotation);
        set_position(this.object, position);
    }
    
    get_bounding_box(){
        this.box.geometry.computeBoundingBox();
        return this.box.geometry.boundingBox;
    }
}
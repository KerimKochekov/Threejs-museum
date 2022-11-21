/**
    Author: Hitarth Singh & Kerim Kochekov
    Project: Museum Imaginarium
    Description: Class for Player
*/

"use strict"; //To use the strict mode of JS.


class Player {
    constructor(camera, room){
        this.angular_velocity = 3;
        this.forward_velocity = 30;
        this.camera = camera;
        this.room = room;
        this.arrow_object = new THREE.ArrowHelper();
        this.rotate_y(0); // to get this.forward updated
        this.arrow_length = 1;
        this.arrow_hex = 0xffff00;
        var origin = new THREE.Vector3();
        origin.copy(camera.position);
//        this.block_rotation = false;
        this.target_movement = null;
        this.target_y_rotation_step = null;
        this.block_movement = false;
        this.total_num_steps = 30;
        this.current_step = 0;
        }
    
    update_arrow(){
        var origin = new THREE.Vector3();
        origin.copy(camera.position);
        this.arrow_object.dir = this.forward;
        this.arrow_object.origin = origin;
    }
    
    step(){
        if (this.block_movement){
            if (this.current_step < this.total_num_steps) {
                    this.current_step += 1;
                    var fraction = 1/this.total_num_steps;
               console.log(this.current_step); 
                if (this.target_movement_step){ 
                    camera.position.add(this.target_movement_step);
                }
                
                if (this.target_y_rotation_step){
                    camera.rotation.y += this.target_y_rotation_step;
                }
                }
            
            else{
                this.current_step = 0;
//                this.block_movement = false;
//                this.target_movement_step = null;
//                this.target_y_rotation_step = null;
//                this.update_arrow();
            }
        }
    }

    rotate_y(bool, back = 1){
        if (bool && !this.block_movement){
            this.target_y_rotation_step = back*this.angular_velocity/this.total_num_steps;
            this.block_movement = true;
        }
//        camera.rotation.y += delta;
        this.forward = new THREE.Vector3( 0, 0, - 1 );
        var axis = new THREE.Vector3( 0, 1, 0 );
        var angle = camera.rotation.y;
        this.forward.applyAxisAngle(axis, angle);
        this.update_arrow();
        
        if (!bool){
            // stop the rotation
            this.target_y_rotation_step = null;
            this.block_movement = false;
        }
    }
    
    move_forward(bool, back=1){
     // create a copy of forward vector
     var vector = this.forward.clone();
     if (bool && !this.block_movement){
//          // first check if the movement is possible or not
//         var final_location = vector.clone().multiplyScalar(1*back*this.forward_velocity).add(camera.position);
         
// //         set_position(drop_sphere, [final_location.x, final_location.y, final_location.z]);
         
//          var triangle = new THREE.Triangle(camera.position, final_location, camera.position); // create a triangle to use intersectTriangle and check if movement is possible
         
//          if (this.room.triangle_intersects(triangle)) {
//              console.log("Debug: Can't move the player/camera.")
//              return;
//          }
        
         // now set the target_movement_step
        this.target_movement_step = vector.clone().multiplyScalar(back*this.forward_velocity/this.total_num_steps);
        this.block_movement = true;
     }
    
    if (!bool){
        // stop the movement
        this.target_movement_step = null;
        this.block_movement = false;
    }
    
    }
}
/**
    Author: Hitarth Singh & Kerim Kochekov
    Project: Museum Imaginarium
    Description: Class for PhotoFrame
*/

"use strict"; //To use the strict mode of JS.



class PhotoFrame {
    constructor(height, width){
        this.height = height;
        this.width = width;
        this.thickness = 1;
        this.image = null;
    }

    set_center(pos){
        // pos is 3 tuple of (x,y,z)
        this.center = pos;
    }

    set_image(image){
        this.image = image;
    }

    get_object(){
        // Returns the Three.js object
    }
}
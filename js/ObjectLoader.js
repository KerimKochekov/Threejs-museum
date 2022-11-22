/**
    Author: Hitarth Singh & Kerim Kochekov
    Project: Museum Imaginarium
    Description: Class for Object (decoration) loader
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

function set_scale(object, scale_value){
    object.scale.set(scale_value, scale_value, scale_value);
}

function load_object(decoration){
    const gltfLoader = new THREE.GLTFLoader();
    var main_object = new THREE.Object3D();
    gltfLoader.load(decoration.path, (gltf) => {
        gltf.scene.traverse(c => {
            c.castShadow = true;
        });
        var objecto = gltf.scene.children[0];
        set_position(objecto, decoration.position);
        set_rotation(objecto, decoration.rotation);
        set_scale(objecto, decoration.scale);
        main_object.add(objecto);
    });
    return main_object;
}
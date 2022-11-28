Vritual-dynamic museum with three.js
========

## Museum Imaginarium ##

The aim of the project is to have a virtual museum game to generate portraits on walls of the image of whatever you want to see.. You can wander around the virtual museum in ghost mode (you can pass trough the walls).

[Examples](http://threejs.org/) — [Documentation](http://threejs.org/docs/) — [Migrating](https://github.com/mrdoob/three.js/wiki/Migration) — [Help](http://stackoverflow.com/questions/tagged/three.js)

### Usage of three.js in your HTML script###

Download the [minified library](http://threejs.org/build/three.min.js) and include it in your html.
Alternatively see [how to build the library yourself](https://github.com/mrdoob/three.js/wiki/build.py,-or-how-to-generate-a-compressed-Three.js-file).

```html
<script src="js/three.min.js"></script>
```
### How to run? ###
- Run server on your local machine in the same directory with *./project/index.html* file.
In my case, I was using the server by Python that listens 8000th port, you can create it with following command:
```
$ python3 -m http.server
```
And go to the [http://localhost:8000](http://localhost:8000/) from your browser to trigger *index.html* and start the game.
  
### Challenges ###
- We could not find a direct way to use Google API within Javascript, and it also had a very limited number of free requests. We wanted to use pure JavaScript so it can run on any machine without the need for a server.
- We faced difficulty while implementing our First Person Camera module which allows the minion to move around. It was particularly challenging to make sure that the movement is smooth as we didn't use any library for these functions.
- Loading and rendering new objects were slowing down the game, so we limited the number of objects by 5. We can increase this number in the future with some specific algorithms (do not load the objects that we do not see or load objects with lower resolution for the mesh).

### Future Work ###
- Try to achieve a more professional first-person view and accurate control-movement system.
- Analysis of different light schemes in the ThreeJS library to have realistic shadows and view.
- Changing the architecture of the museum dynamically depending upon how big or small the museum the user wants to tour. This feature should create well-connected rooms and multiple floors through which the player can move and discover new objects. 
- Dynamically arranges the 3D objects around the room in each run of the game so that player never gets bored.
- To have animated objects in the game world that can make the game more interesting. 
- Have a goal in the game like collecting hidden flags and giving points for this to the player. This will make sure that the user tries to go through all the rooms and hidden doors of the game and tries to collect all the flags. We believe this will make the game more thrilling. 
- To allow the user to take screenshots of the museum from at any given point. 
- With the help of the ThreeJS library, support the VR or AR devices to enjoy a virtual museum from a realistic perspective.
- Try to integrate ML models to generate images to present the museum and not have copyright issues.
- We will like to integrate Google Image API with our game to have more relevant images in our game.

[Report](https://github.com/KerimKochekov/threejs-museum/blob/main/Museum_Imaginarium_Report.pdf)

### Screenshots ###
![](https://github.com/KerimKochekov/WebGL-Project/blob/main/assets/screenshots/0.PNG)
![](https://github.com/KerimKochekov/WebGL-Project/blob/main/assets/screenshots/1.PNG)
![](https://github.com/KerimKochekov/WebGL-Project/blob/main/assets/screenshots/2.PNG)
![](https://github.com/KerimKochekov/WebGL-Project/blob/main/assets/screenshots/3.PNG)

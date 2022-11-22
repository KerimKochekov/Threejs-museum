/**
    Author: Hitarth Singh & Kerim Kochekov
    Project: Museum Imaginarium
    Description: Listening Enter key to start the game
*/

var input = document.getElementById("fname");

input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    console.log(input.value);
    window.location.href = 'game.html' + '?name=' + input.value;
  }
});
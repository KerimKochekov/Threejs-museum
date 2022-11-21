var input = document.getElementById("fname");

input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    console.log(input.value);
    window.location.href = 'game.html' + '?name=' + input.value;
  }
});
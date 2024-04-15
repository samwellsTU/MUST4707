const toggleButton = document.getElementById("togButton");
console.log(toggleButton);
const togLabel = document.getElementById("togLabel");
toggleButton.addEventListener("change", function () {
  if (this.checked) {
    togLabel.innerText = "ON";
  } else {
    togLabel.innerText = "OFF";
  }
});

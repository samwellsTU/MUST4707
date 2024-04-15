// Adds an event listener to the 'Click Me!' button for click events
document.getElementById("alert-button").addEventListener("click", function () {
  alert("Button clicked!"); // Shows an alert dialog when the button is clicked
});

// Adds an event listener to the text input field for input events (as the user types)
document.getElementById("text-input").addEventListener("input", function (e) {
  console.log("Text input value:", e.target.value); // Logs every input change to the console
});

// Adds an event listener to the slider for input events (as the value changes)
document.getElementById("range-slider").addEventListener("input", function (e) {
  console.log("Slider value:", e.target.value); // Logs the slider's value to the console
});

// Adds an event listener to the dropdown menu for change events (when a different option is selected)
document
  .getElementById("dropdown-menu")
  .addEventListener("change", function (e) {
    console.log("Dropdown selected:", e.target.value); // Logs the selected option to the console
  });

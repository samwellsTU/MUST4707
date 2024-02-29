document.addEventListener("DOMContentLoaded", function () {
  // Click event
  document
    .getElementById("click-demo")
    .querySelector("button")
    .addEventListener("click", function () {
      alert("Button clicked!");
    });

  // Mouseover event

  document
    .getElementById("mouseover-demo")
    .addEventListener("mouseover", function () {
      document.getElementById("mouseover-demo").style.backgroundColor = "green";
    });

  // Mouseout event

  document
    .getElementById("mouseover-demo")
    .addEventListener("mouseout", function () {
      document.getElementById("mouseover-demo").style.backgroundColor =
        "#f9f9f9";
    });

  // Keydown event
  document
    .getElementById("keydown-demo")
    .querySelector("input")
    .addEventListener("keydown", function (e) {
      alert(`Key "${e.key}" down`);
    });

  // Input event
  document
    .getElementById("input-demo")
    .querySelector("input")
    .addEventListener("input", function (e) {
      console.log("Input value changed to: ", e.target.value);
    });

  // Scroll event
  document
    .getElementById("scroll-demo")
    .addEventListener("scroll", function () {
      console.log("You scrolled in the box!");
    });

  // Resize event
  window.addEventListener("resize", function () {
    console.log("Window resized!");
  });
});

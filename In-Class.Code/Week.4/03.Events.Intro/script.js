//Event Interaction

const button_click = function () {
  let usr_input = document.getElementById("userInput");
  console.log(usr_input.value);
};

const do_stuff = function () {
  let button = document.getElementById("displayBtn");
  button.addEventListener("click", button_click);
  // console.log("stuff");
};

document.addEventListener("DOMContentLoaded", do_stuff);

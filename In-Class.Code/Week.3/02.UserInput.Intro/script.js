// Introduction to User Input and Alerts in JavaScript

let myname;

myname = prompt("What is your name");
let mood = prompt(`Hi, ${myname}! How are you?`);

if (mood == "good") {
  alert("That's nice to hear");
}

if (mood == "bad") {
  prompt("Oh no, how can I help?");
}

let rating = prompt("on a scale of 1-10?");

rating = parsenInt(rating);

console.log(typeof rating);

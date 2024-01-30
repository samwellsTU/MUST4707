// Introduction to User Input and Alerts in JavaScript

// Using prompt() to Get User Input
let userName = prompt("Enter your name:");
alert("Hello, " + userName + "! Welcome to our website.");

// Example: Using User Input in a Conditional with Alert
let userAge = prompt("Enter your age:");
userAge = parseInt(userAge); // Converting the input to a number

if (userAge >= 18) {
  alert("You are an adult.");
} else {
  alert("You are a minor.");
}

// Example: Asking the User's Favorite Color
let favoriteColor = prompt("What is your favorite color?");

if (favoriteColor.toLowerCase() === "blue") {
  alert("You love blue! That's a great choice.");
} else {
  alert("Your favorite color is " + favoriteColor + ".");
}

// Conclusion
// The prompt() function is used for getting input, and alert() is used for displaying messages.
// These functions are useful for basic interaction with the user in JavaScript.

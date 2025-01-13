// Introduction to Conditionals and Operators in JavaScript

// Comparison Operators
let testScore = 80;

// Equal to (==)
if (testScore == 80) {
  console.log("Score is exactly 80");
}

// Greater than (>)
if (testScore > 50) {
  console.log("Score is greater than 50");
}

// Less than (<)
if (testScore < 90) {
  console.log("Score is less than 90");
}

// Greater than or equal to (>=)
if (testScore >= 80) {
  console.log("Score is 80 or more");
}

// Less than or equal to (<=)
if (testScore <= 80) {
  console.log("Score is 80 or less");
}

// Logical Operators
let age = 20;
let hasPermission = true;

// AND (&&)
if (age > 18 && hasPermission) {
  console.log("Access granted");
}

// OR (||)
if (age < 18 || hasPermission) {
  console.log("Access might be granted");
}

// NOT (!)
if (!hasPermission) {
  console.log("Access denied");
} else {
  console.log("Access allowed");
}

// Using else if for Multiple Conditions
let temperature = 15;

if (temperature > 30) {
  console.log("It's very hot outside!");
} else if (temperature > 20) {
  console.log("It's warm outside!");
} else if (temperature > 10) {
  console.log("It's cool outside!");
} else {
  console.log("It's cold outside!");
}

// Conclusion
// Using comparison and logical operators in conditionals allows for complex decision-making in JavaScript.

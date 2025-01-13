// Introduction to Variables
// Variables are like containers for storing data values.
let gameTitle = "Space Adventure";
console.log("Game Title:", gameTitle); // Output: Game Title: Space Adventure

// Understanding Global Scope
// A variable declared outside any object or block is globally accessible.
var globalVar = "I'm a global variable";
console.log(globalVar); // Accessible globally

// Understanding Local Scope with Objects
// Here, we use an object to create a local scope.
let game = {
  name: "Space Adventure",
  startGame: function () {
    let localScopeVar = "Starting Game...";
    console.log(localScopeVar); // Accessible within this method
  },
  showScore: function () {
    let score = 100;
    console.log("Score:", score); // Accessible within this method
  },
};

game.startGame(); // Outputs "Starting Game..."
game.showScore(); // Outputs "Score: 100"
// console.log(localScopeVar); // Uncaught ReferenceError: localScopeVar is not defined

// Introduction to Block Scope with let and const
// Variables declared with 'let' or 'const' are confined within the block they are declared in.
if (true) {
  let blockScopedLet = "I'm block scoped with let";
  const blockScopedConst = "I'm block scoped with const";
  console.log(blockScopedLet); // Accessible within this block
  console.log(blockScopedConst); // Accessible within this block
}
// console.log(blockScopedLet);   // Uncaught ReferenceError: blockScopedLet is not defined
// console.log(blockScopedConst); // Uncaught ReferenceError: blockScopedConst is not defined

// Reassigning and Redeclaring with let and const
let reassignableVar = "Initial Value";
console.log(reassignableVar); // Output: Initial Value

reassignableVar = "New Value";
console.log(reassignableVar); // Output: New Value

// 'const' does not allow reassigning or redeclaring.
const constantVar = "Constant Value";
console.log(constantVar); // Output: Constant Value

// constantVar = "New Value"; // Uncaught TypeError: Assignment to constant variable.

// Mutating Objects and Arrays declared with const
const player = { name: "Alex" };
player.name = "Jordan";
console.log(player); // Output: { name: "Jordan" }

const levels = ["Level 1", "Level 2"];
levels.push("Level 3");
console.log(levels); // Output: ["Level 1", "Level 2", "Level 3"]

// Conclusion
// Use 'let' for variables that will change and 'const' for variables that should remain constant.
// Remember, 'let' and 'const' provide block-scoped variables, offering better scope management.

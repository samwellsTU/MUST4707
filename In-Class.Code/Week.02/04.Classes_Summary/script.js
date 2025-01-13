/**
 * In this file:
 *
 * We start by importing MyAwesomeClass from MyAwesomeClass.js using the import statement.
 *
 * We then create three instances of MyAwesomeClass, each with different names and flavors
 * to demonstrate the versatility of the class constructor and its methods.
 *
 * For each instance, we showcase different methods (sayName, sayAge, setAge, turnOn, and turnOff)
 * to demonstrate how to interact with the class's properties and methods.
 *
 *
 */

// Import MyAwesomeClass from the MyAwesomeClass.js file
import { MyAwesomeClass } from './MyAwesomeClass.js';

// Create the first instance of MyAwesomeClass
// Passing 'Alice' as the name and 'Strawberry' as the flavor
const instance1 = new MyAwesomeClass('Alice', 'Strawberry');
// Use the sayName method to log "Hi, my name is Alice"
instance1.sayName();
// Use the sayAge method to log Alice's current and future age in days
instance1.sayAge();

// Create the second instance of MyAwesomeClass
// Passing 'Bob' as the name and 'Vanilla' as the flavor
const instance2 = new MyAwesomeClass('Bob', 'Vanilla');
// Turning on the second instance using the turnOn method
instance2.turnOn();
// Use the sayName method to log "Hi, my name is Bob"
instance2.sayName();

// Create the third instance of MyAwesomeClass
// Passing 'Charlie' as the name and 'Chocolate' as the flavor
const instance3 = new MyAwesomeClass('Charlie', 'Chocolate');
// Setting a new age for Charlie using the setAge method
instance3.setAge(100);
// Turning off the third instance using the turnOff method
instance3.turnOff();

// Note: The console.log outputs will appear in the JavaScript console
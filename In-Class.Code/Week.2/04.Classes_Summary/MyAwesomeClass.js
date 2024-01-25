/**
Steps to making a class
 *
 * class Classname {                                   //Step 1- Declare the class
 *  constructor(param1, param2, etc.) {              //Step 2 - make the constructor, this is what is used later to make a new instance of this class!
 *      this.prop1 = initial value (you pick!)   //define the PROPERITES OF THE CLASS
 *      this.prop2 = initial value (you pick!)
 *      this.prop3= initial value (you pick!)
 *      etc.....
 *      }
 *      method1() {
 *          do some code here
 *      }
 *      method1() {
 *          do some code here
 *       }
 * }
 *
 */

// Define a class named MyAwesomeClass
class MyAwesomeClass {
    // Constructor method for creating and initializing an object instance of the class
    constructor(input1, input2) {
        // Assigning the first input parameter to the 'name' property of the instance
        this.name = input1;
        // Assigning the second input parameter to the 'flavor' property of the instance
        this.flavor = input2;
        // Initializing the 'on_off' property to false, indicating an "off" state by default
        this.on_off = false;
        // Setting a default 'age' property to 32
        this.age = 32;
    }

    // Method to log the name property to the console
    sayName() {
        console.log(`Hi, my name is ${this.name}`);
    }

    // Method to log the current age and the age in a week
    sayAge() {
        console.log(`Hi, I'm am ${this.age} days old. In one week I will be ${this.age + 7} days old.`);
    }

    // Method to set a new age and then log the updated age
    setAge(newAge) {
        this.age = newAge; // Update the 'age' property with the newAge parameter
        this.sayAge(); // Call the sayAge method to log the new age
    }

    // Method to turn the state to "on"
    turnOn() {
        this.on_off = true;
    }

    // Method to turn the state to "off"
    turnOff() {
        this.on_off = false;
    }
}

// Export the MyAwesomeClass so it can be imported and used in other files
export { MyAwesomeClass };
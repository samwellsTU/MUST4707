class Train {
    constructor(name, numberCars, powerType, cargo) {
      this.name = name;
      this.numCars = numberCars;
      this.powerSource = powerType;
      this.cargo = cargo;
      this.caboose = false;
    }
    go() {
      console.log("Chugga chugga chugga chugga chugga...");
    }
    derail() {
      console.log("uh oh");
    }
    addCars(num) {
      this.numCars = this.numCars + num;
    }
  }
  export {Train}; from ("./Train.");

  class Bike {
    constructor(type, color) {
        this.type = type;
        this.color = color;
    }
    go() {
        console.log("pedal pedal pedal");
    }
    wheelie() {
        console.log("WEEEEEEEEEE");
    }
    paint(newColor) {
        this.colo = newColor;
        console.log(`Hey`)
    }
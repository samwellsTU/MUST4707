//Let's make some objects again!
import { Train } from "./Train.js";

const train1 = new Train("SEPTA Train", 30, "electric", "philadelphians");
const train2 = new Train("Amtrak", 7, "Diesel", "Mail");
const train3 = new Train("LIRR", 4, "Electric", "Long Islanders");
const train4 = new Train("Metro", 2, "Electric", "NYC");

const mymetaTrain = {
  size: "huge",
  powerSource: "coals",
  numCars: 10,
  caboose: true,
  cargo: "smaller trains",
  go: function () {
    console.log("Chugga chugga chugga chugga chugga...");
  },
  derail: function () {
    console.log("uh oh");
  },
  stop: function () {
    console.log("the train has stopped!");
  },
  getInfo: function () {
    console.log(
      `The train is ${this.size}. It has ${this.numCars} and is powered by ${this.powerSource}`
    );
  },
};

const literalTrain = {
  size: "small",
  powerSource: "electric",
  numCars: 56,
  caboose: true,
  cargo: "people",
  go: function () {
    console.log("Chugga chugga chugga chugga chugga...");
  },
  derail: function () {
    console.log("uh oh");
  },
  stop: function () {
    console.log("the train has stopped!");
  },
  getInfo: function () {
    console.log(
      `The train is ${this.size}. It has ${this.numCars} and is powered by ${this.powerSource}`
    );
  },
};

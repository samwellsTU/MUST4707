//Let's make some objects again!

//so many objects

const apple = {
  color: "red",
  size: "huge",
  flavorRating: 10,
  stolen: true,
  howBig: function () {
    console.log("Hi, I'm an apple. I am " + this.size + ".");
  },
  howTatsy: function () {
    console.log(`I am a ${this.flavorRating} out of 10 in terms of tastiness!`);
  },
};

const apple2 = {
  color: "green",
  size: "medium",
  flavorRating: 2,
  stolen: false,
  howBig: function () {
    console.log("Hi, I'm an apple. I am " + this.size + ".");
  },
  howTatsy: function () {
    console.log(`I am a ${this.flavorRating} out of 10 in terms of tastiness!`);
  },
};

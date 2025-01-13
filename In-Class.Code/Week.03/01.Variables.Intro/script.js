const key = "D major";
console.log(key);

const interval = 7;
const drums = true;

console.log("hello");

const sayHello = function (name) {
  console.log(`Hi, ${name}.`);
};

sayHello("Stella");
sayHello("Astro");
sayHello("Sam");
sayHello("Temple");

const makeChord = function (root, quality) {
  let chordRoot = root;
  let third;
  let fifth;
  if (quality == "major") {
    third = chordRoot + 4;
    fifth = chordRoot + 7;
  } else if (quality == "minor") {
    third = chordRoot + 3;
    fifth = chordRoot + 7;
  } else if (quality == "augmented") {
    third = chordRoot + 4;
    fifth = chordRoot + 8;
  } else if (quality == "diminished") {
    third = chordRoot + 3;
    fifth = chordRoot + 6;
  } else if (quality == "sus4") {
    third = chordRoot + 5;
    fifth = chordRoot + 7;
  } else if (quality == "sus2") {
    third = chordRoot + 2;
    fifth = chordRoot + 7;
  }

  return [chordRoot, third, fifth];
};

let cMaj = makeChord(60, "major");
console.log(cMaj);

makeChord(60, "minor");
makeChord(64, "sus2");
makeChord(64, "augmented");

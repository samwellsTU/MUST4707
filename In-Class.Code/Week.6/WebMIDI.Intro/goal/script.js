//await in JavaScript is used to pause the execution of an async function
//until a Promise is resolved. When you use await before a function that
//returns a Promise, it makes JavaScript wait until that Promise settles
//and then returns its result.
let myChord = [60, 64, 67, 71, 74, 78, 81];

await WebMidi.enable();

const playIt = function (pitch) {
  let myNote = new Note(pitch, { duration: 1000, rawAttack: 127 });

  WebMidi.outputs[0].channels[1].playNote(myNote);
};

document.getElementById("play").addEventListener("click", function () {
  myChord.forEach(function (e) {
    playIt(e);
  });
});

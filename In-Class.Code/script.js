await WebMidi.enable();

// console.log(WebMidi.outputs);
// console.log(WebMidi.outputs[0]);

/*
Note makes a new instance of a note that formats MIDI correctly
takes
1.midi pitch number
2.object full of musical properties
*/
// let pitch = 69;
// let noteParams = {
//   duration: 1000, //ms
// };

// let myFirstNote = new Note(pitch, noteParams);
// let third = new Note(73, noteParams);
// let fifth = new Note(76, noteParams);
// // let otherNote = new Note(60,{duration:1000});
// WebMidi.outputs[3].channels[1].playNote(myFirstNote);
// WebMidi.outputs[3].channels[1].playNote(third);
// WebMidi.outputs[3].channels[1].playNote(fifth);

document.getElementById("play").addEventListener("click", function () {
let mychord = [60, 67, 67, 71, 74, 78, 81];
let transpose = Math.floor(Math.random()*24) -12
mychord.forEach(function (new_pitch) {
  let note = new Note(new_pitch + 7 , { duration: 2000 });
  WebMidi.outputs[3].channels[1].playNote(note);
});
});
console.log(WebMidi.outputs);

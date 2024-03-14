await WebMidi.enable();

let myInput = WebMidi.inputs[0];
let myOutput = WebMidi.outputs[0].channels[1];

let dropIns = document.getElementById("dropdown-ins");
let dropOuts = document.getElementById("dropdown-outs");
let slider = document.getElementById("transpoSlider");

slider.addEventListener("change", function () {
  document.getElementById(
    "transpoDisplay"
  ).innerText = `${slider.value} semitones`;
});

WebMidi.inputs.forEach(function (input, num) {
  dropIns.innerHTML += `<option value=${num}>${input.name}</option>`;
});

WebMidi.outputs.forEach(function (output, num) {
  dropOuts.innerHTML += `<option value=${num}>${output.name}</option>`;
});

const midiProcess = function (midiIN, transpose) {
  let pitch = midiIN.note.number;
  pitch += transpose;
  let myNewNote = new Note(pitch, { rawAttack: 101 });
  return myNewNote;
};

dropIns.addEventListener("change", function () {
  if (myInput.hasListener("noteon")) {
    myInput.removeListener("noteon");
  }
  if (myInput.hasListener("noteoff")) {
    myInput.removeListener("noteoff");
  }

  myInput = WebMidi.inputs[dropIns.value];

  myInput.addListener("noteon", function (someMIDI) {
    console.log(
      `My note is ${someMIDI.note.identifier}, it is pitch ${someMIDI.note.number}, with a velocity of ${someMIDI.note.rawAttack}`
    );
    myOutput.sendNoteOn(midiProcess(someMIDI, parseInt(slider.value)));
  });

  myInput.addListener("noteoff", function (someMIDI) {
    myOutput.sendNoteOff(someMIDI.note);
    myOutput.sendNoteOn(midiProcess(someMIDI, parseInt(slider.value)));
  });
});

dropOuts.addEventListener("change", function () {
  myOutput = WebMidi.outputs[dropOuts.value].channels[1];
});

// Enable WebMidi API and handle any errors if it fails to enable.
// This is necessary to work with MIDI devices in the web browser.
await WebMidi.enable();

// Initialize variables to store the first MIDI input and output devices detected.
// These devices can be used to send or receive MIDI messages.
let myInput = WebMidi.inputs[0];
let myOutput = WebMidi.outputs[0];

const scales = {
  cMajor: [0, 2, 4, 5, 7, 9, 11],
  dMajor: [1, 2, 4, 6, 7, 9, 11],
  cMajPent: [0, 2, 4, 7, 9],
  justC: [0],
};

let chosenScale = scales.cMajor;

// Get the dropdown elements from the HTML document by their IDs.
// These dropdowns will be used to display the MIDI input and output devices available.
let dropIns = document.getElementById("dropdown-ins");
let dropOuts = document.getElementById("dropdown-outs");
let dropScale = document.getElementById("dropdown-scale");

for (let scaleName in scales) {
  dropScale.innerHTML += `<option value=${scaleName}>${scaleName}</option>`;
}

// For each MIDI input device detected, add an option to the input devices dropdown.
// This loop iterates over all detected input devices, adding them to the dropdown.
WebMidi.inputs.forEach(function (input, num) {
  dropIns.innerHTML += `<option value=${num}>${input.name}</option>`;
});

// Similarly, for each MIDI output device detected, add an option to the output devices dropdown.
// This loop iterates over all detected output devices, adding them to the dropdown.
WebMidi.outputs.forEach(function (output, num) {
  dropOuts.innerHTML += `<option value=${num}>${output.name}</option>`;
});

/**
 * a recursive fucntion that transposes a note down a half step over and over until it is
 * in a key
 * @param {number} midi_number
 * @returns {number}
 */
const remap = function (midi_number) {
  if (chosenScale.includes(midi_number % 12)) {
    return midi_number;
  } else {
    return remap(midi_number - 1);
  }
  //return transposed note number
};

// Add an event listener for the 'change' event on the input devices dropdown.
// This allows the script to react when the user selects a different MIDI input device.
dropIns.addEventListener("change", function () {
  // Before changing the input device, remove any existing event listeners
  // to prevent them from being called after the device has been changed.
  if (myInput.hasListener("noteon")) {
    myInput.removeListener("noteon");
  }
  if (myInput.hasListener("noteoff")) {
    myInput.removeListener("noteoff");
  }

  // Change the input device based on the user's selection in the dropdown.
  myInput = WebMidi.inputs[dropIns.value];

  // After changing the input device, add new listeners for 'noteon' and 'noteoff' events.
  // These listeners will handle MIDI note on (key press) and note off (key release) messages.
  myInput.addListener("noteon", function (someMIDI) {
    // When a note on event is received, send a note on message to the output device.
    // This can trigger a sound or action on the MIDI output device.

    let noteNumber = someMIDI.note.number;

    let myNote = new Note(remap(noteNumber));
    myOutput.sendNoteOn(myNote);
  });

  myInput.addListener("noteoff", function (someMIDI) {
    // Similarly, when a note off event is received, send a note off message to the output device.
    // This signals the end of a note being played.
    let noteNumber = someMIDI.note.number;

    let myNote = new Note(remap(noteNumber));
    myOutput.sendNoteOff(myNote);
  });
});

// Add an event listener for the 'change' event on the output devices dropdown.
// This allows the script to react when the user selects a different MIDI output device.
dropOuts.addEventListener("change", function () {
  // Change the output device based on the user's selection in the dropdown.
  // The '.channels[1]' specifies that the script should use the first channel of the selected output device.
  // MIDI channels are often used to separate messages for different instruments or sounds.
  myOutput = WebMidi.outputs[dropOuts.value].channels[1];
});

dropScale.addEventListener("change", function () {
  chosenScale = scales[dropScale.value];
  console.log(dropScale.value);
});

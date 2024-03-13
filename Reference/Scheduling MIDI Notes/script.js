//await in JavaScript is used to pause the execution of an async function
//until a Promise is resolved. When you use await before a function that
//returns a Promise, it makes JavaScript wait until that Promise settles
//and then returns its result.

await WebMidi.enable();

let myOutput = WebMidi.outputs[0].channels[1];

// Get the dropdown elements from the HTML document by their IDs.
// These dropdowns will be used to display the MIDI input and output devices available.

let dropOuts = document.getElementById("dropdown-outs");

// For each MIDI input device detected, add an option to the input devices dropdown.
// This loop iterates over all detected input devices, adding them to the dropdown.

// Similarly, for each MIDI output device detected, add an option to the output devices dropdown.
// This loop iterates over all detected output devices, adding them to the dropdown.
WebMidi.outputs.forEach(function (output, num) {
  dropOuts.innerHTML += `<option value=${num}>${output.name}</option>`;
});
// Add an event listener for the 'change' event on the input devices dropdown.
// This allows the script to react when the user selects a different MIDI input device.

// Add an event listener for the 'change' event on the output devices dropdown.
// This allows the script to react when the user selects a different MIDI output device.
dropOuts.addEventListener("change", function () {
  // Change the output device based on the user's selection in the dropdown.
  // The '.channels[1]' specifies that the script should use the first channel of the selected output device.
  // MIDI channels are often used to separate messages for different instruments or sounds.
  myOutput = WebMidi.outputs[dropOuts.value].channels[1];
});

/**
 * Function to play a sequence of MIDI notes.
 * This function uses the WebMidi.js library to send MIDI messages to a connected MIDI output device.
 * Each note is played for a specific duration before turning off, creating a simple melody.
 */
const playIt = function () {
  // Plays the MIDI note 63 (E♭ in the 4th octave in standard MIDI note numbers) immediately.
  myOutput.sendNoteOn(63, { time: WebMidi.time });
  // Turns off the MIDI note 63 after 250 milliseconds.
  myOutput.sendNoteOff(63, { time: WebMidi.time + 250 });

  // Plays the MIDI note 65 (F in the 4th octave) 250 milliseconds after the previous note is turned off.
  myOutput.sendNoteOn(65, { time: WebMidi.time + 250 });
  // Turns off the MIDI note 65 after a total of 750 milliseconds from the start.
  myOutput.sendNoteOff(65, { time: WebMidi.time + 750 });

  // Continues the pattern with MIDI note 67 (G in the 4th octave), starting 750 milliseconds after the start.
  myOutput.sendNoteOn(67, { time: WebMidi.time + 750 });
  // Turns off the MIDI note 67 after a total of 1250 milliseconds from the start.
  myOutput.sendNoteOff(67, { time: WebMidi.time + 1250 });

  // Plays the MIDI note 72 (C in the 5th octave), starting 1250 milliseconds after the start.
  myOutput.sendNoteOn(72, { time: WebMidi.time + 1250 });
  // Turns off the MIDI note 72 after a total of 1750 milliseconds from the start.
  myOutput.sendNoteOff(72, { time: WebMidi.time + 1750 });

  // Finally, plays the MIDI note 70 (A# in the 4th octave), starting 1750 milliseconds after the start.
  myOutput.sendNoteOn(70, { time: WebMidi.time + 1750 });
  // Turns off the MIDI note 70 after a total of 3000 milliseconds from the start, concluding the melody.
  myOutput.sendNoteOff(70, { time: WebMidi.time + 3000 });
};

/**
 * Adds an event listener to the element with the ID "play".
 * When this element is clicked, the playIt function is called to play the sequence of notes.
 */
document.getElementById("play").addEventListener("click", function () {
  playIt();
});

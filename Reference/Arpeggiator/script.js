/**
 * This script manages the user interface interactions for the Arpeggiator application.
 * It handles the setup of MIDI inputs and outputs, parameter adjustments, and updates the UI elements accordingly.
 */

// Import Arpeggiator and MidiManager classes from Arpeggiator.js
import { Arpeggiator, MidiManager } from "./Arpeggiator.js";

// DOM element references
const dropIns = document.getElementById("dropdown-ins"); // MIDI input dropdown
const dropOuts = document.getElementById("dropdown-outs"); // MIDI output dropdown
const subdivMenu = document.getElementById("subdiv"); // Subdivision menu
const slider = document.getElementById("transposer"); // Transpose slider
const sliderValue = document.getElementById("transposeValue"); // Transpose value display
const tempoSlider = document.getElementById("bpmSet"); // BPM slider
const lengthSlider = document.getElementById("noteLength"); // Note length slider
const lengthValue = document.getElementById("noteLengthValue"); // Note length display
const tempoValue = document.getElementById("bpmValue"); // Tempo display

/**
 * Function to update the user interface.
 * Populates MIDI input/output dropdowns and sets up event listeners for UI elements.
 */
const updateUI = function () {
  // Populate MIDI output options
  app.midi.outputs.forEach((element, index) => {
    dropOuts.innerHTML += `<option value=${index}>${element.name}</option>`;
  });

  // Populate MIDI input options
  app.midi.inputs.forEach((element, index) => {
    dropIns.innerHTML += `<option value=${index}>${element.name}</option>`;
  });

  // Event listener for changing MIDI input
  dropIns.addEventListener("change", () => {
    let newInput = app.midi.inputs[dropIns.value].channels[1];
    app.changeInput(newInput);
  });

  // Event listener for changing MIDI output
  dropOuts.addEventListener("change", () => {
    let newOutput = app.midi.outputs[dropOuts.value].channels[2];
    app.changeOutput(newOutput);
  });

  // Populate subdivision options and setup listener
  for (let r in app.subdivisions) {
    subdivMenu.innerHTML += `<option value=${app.subdivisions[r]}>${r}</option>`;
  }
  subdivMenu.selectedIndex = 1;
  subdivMenu.addEventListener("change", () => {
    app.subdivision = +subdivMenu.value;
    app.setBPM(app.bpm);
  });

  // Setup transpose slider listener
  slider.addEventListener("input", () => {
    sliderValue.textContent = `Tranposition: ${slider.value} semitones`;
    app.transosition = +slider.value;
  });

  // Setup note length slider listener
  lengthSlider.addEventListener("input", () => {
    lengthValue.textContent = `Note Length: ${lengthSlider.value}%`;
    app.noteLength = +lengthSlider.value / 100;
  });

  // Setup tempo slider listener
  tempoSlider.addEventListener("input", () => {
    tempoValue.textContent = `Tempo: ${tempoSlider.value} bpm`;
    app.bpm = +tempoSlider.value;
    app.setBPM(app.bpm);
  });
};

// Create Arpeggiator instance and initialize
const app = new Arpeggiator();
app.init().then(updateUI);

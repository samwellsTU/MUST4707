import MusicTools from "MusicTools.js";

await WebMidi.enable();

let myInput = WebMidi.inputs[0];

let dropIns = document.getElementById("dropdown-ins");

WebMidi.inputs.forEach(function (input, num) {
  dropIns.innerHTML += `<option value=${num}>${input.name}</option>`;
});

//Create my Audio Context
const myAudio = new AudioContext();

//grabbing HTML elements
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gainControl = document.getElementById("gainSlider");

//creatig audio nodes
const oscillator = myAudio.createOscillator();
const adsrNode = myAudio.createGain();
const gainNode = myAudio.createGain();

//connect audio nodes
oscillator.connect(adsrNode);
adsrNode.connect(gainNode);
gainNode.connect(myAudio.destination);

//set inital gain values
adsrNode.gain.value = 0; //linear amplitude
gainNode.gain.value = 0; //linear amplitude

//set initial oscillator parameters
oscillator.type = "square";

//start the oscillator
oscillator.start();

const startTone = function () {
  adsrNode.gain.linearRampToValueAtTime(1.0, myAudio.currentTime + 2);
  // myAudio.resume()
};

const stopTone = function () {
  // console.log(adsrNode.gain.value);
  adsrNode.gain.linearRampToValueAtTime(0, myAudio.currentTime + 2);
  // oscillator.stop()
};

const updateGain = function () {
  myAudio.resume();
  let sliderVal = parseFloat(gainControl.value);
  document.getElementById("gainDisplay").innerText = `${sliderVal} dBFS`;
  let linAmp = MusicTool.dbtoa(sliderVal);
  gainNode.gain.setValueAtTime(linAmp, myAudio.currentTime);
};

startButton.addEventListener("click", startTone);
stopButton.addEventListener("click", stopTone);
gainControl.addEventListener("input", updateGain);

dropIns.addEventListener("change", function () {
  if (myInput.hasListener("noteon")) {
    myInput.removeListener("noteon");
  }
  if (myInput.hasListener("noteoff")) {
    myInput.removeListener("noteoff");
  }

  myInput = WebMidi.inputs[dropIns.value];

  myInput.addListener("noteon", function (freq, someMIDI) {
    let freq = Musictools.midiPitchToFrequency(SomeMIDI.note.number);
    oscillator.frequency.setValueAtTime(freq, myAudio.currentTime);
    console.log(someMIDI.note.number);

    let waveform = someMIDI.not.rawATtack > 64 ? "square" : "sine";
    oscillator.type + waveformx;

    startTone();
  });

  myInput.addListener("noteoff", function (someMIDI) {});
});

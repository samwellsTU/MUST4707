import {musicTools} from "./MusicTools.js";

// Enable WebMidi API and handle any errors if it fails to enable.
// This is necessary to work with MIDI devices in the web browser.
await WebMidi.enable();
const audCtx = new (AudioContext || webkit.AudioContext)();

//create Nodes
//microphone input
let micSource = null; //empty variable to be populated later
let fileBuffer = null;


//oscillator
const osc = audCtx.createOscillator()
const adsr = audCtx.createGain()



const inputSwitch = audCtx.createGain();
const drySig = audCtx.createGain();
const wetSig = audCtx.createGain();
const panner = audCtx.createStereoPanner()
const volume = audCtx.createGain();

//fx
//ring mod
const modulationSig = audCtx.createOscillator()
// const modulationGain = audCtx.createGain();
const ringMod = audCtx.createGain();
const distortion = audCtx.createWaveShaper()
const delay = audCtx.createDelay()
const feedback = audCtx.createGain();


//routing that will not change
inputSwitch.connect(drySig)
drySig.connect(panner)
wetSig.connect(panner)
panner.connect(volume)
volume.connect(audCtx.destination)
delay.connect(feedback)
feedback.connect(delay)


modulationSig.connect(ringMod.gain)
modulationSig.start()



//initial param
delay.delayTime.setValueAtTime(250, audCtx.currentTime)
feedback.gain.setValueAtTime(0, audCtx.currentTime)

// Get the dropdown elements from the HTML document by their IDs.
// These dropdowns will be used to display the MIDI input and output devices available.
let dropIns = document.getElementById("dropIns");

WebMidi.inputs.forEach(function (input, num) {

    dropIns.innerHTML += `<option value=${num}>${input.name}</option>`;
});


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
        osc.frequency.setValueAtTime(musicTools.midiPitchToFrequency(someMIDI.note.number), audCtx.currentTime)
        startTone()
    });
    myInput.addListener("noteoff", function (someMIDI) {
        // Similarly, when a note off event is received, send a note off message to the output device.
        // This signals the end of a note being played.
        stopTone()
    });
});



 const startTone = function() {

        adsr.gain.linearRampToValueAtTime(1.0, myAudio.currentTime + 0.1)
    }

    const stopTone = function() {
        // Log the current gain value of the ADSR node for debugging.
        // console.log(adsrNode.gain.value)

        // Ramp down the gain of the ADSR node to 0 over 2 seconds for the fade-out effect.
        adsr.gain.linearRampToValueAtTime(0., myAudio.currentTime + 1.0)
    }


// Function to decode the fetched audio data.
// const decodeAudioData = async function (arrayBuffer) {
//     // Decode the ArrayBuffer into an AudioBuffer using the AudioContext.
//     const audioBuffer = await audCtx.decodeAudioData(arrayBuffer);
//     return audioBuffer;
// };


const loadPlayFileIntoBuffer = function() {
    let fileLoad = document.getElementById("uploadFile");
    let file = fileLoad.files[0];
    if (!file) {
        console.log("No file selected");
        return;
    }
    let fileReader = new FileReader();

    fileReader.onload = function (event) {
        fileBuffer = audCtx.createBufferSource()
        audCtx.decodeAudioData(event.target.result, function(buffer) {
            fileBuffer.buffer = buffer;
            console.log("Buffer loaded into fileBuffer");
            fileBuffer.connect(inputSwitch)
            fileBuffer.start()

        }, function(err) {
            console.error("Error decoding audio data", err);
        });
    };

    fileReader.readAsArrayBuffer(file);
    console.log("File load started");
}


const makeDistortionCurve = function(amount) {
    const k = typeof amount === "number" ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;

    for (let i = 0; i < n_samples; i++) {
        const x = (i * 2) / n_samples - 1;
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
}

// document.getElementById("uploadFile").addEventListener("change", function(){
//     loadFileIntoBuffer()
//     console.log(fileBuffer)
// })









const selectMicInput = async function() {
  try {
      //to disconnect any micSource connections
      // if (!micSource){
      //     micSource.disconnect(inputSwitch)
      // }
      const micInput = await navigator.mediaDevices.getUserMedia({ audio: true });

    micSource = audCtx.createMediaStreamSource(micInput);
    micSource.connect(inputSwitch)

  } catch (err) {
    console.error('Error accessing the microphone:', err);
  }
}



//event listeners
document.getElementById("micSelect").addEventListener("change", function() {
    if (this.checked) {
        console.log("mic")
        selectMicInput()
        adsr.disconnect()
        fileBuffer.disconnect()
    }
})

document.getElementById("synthSelect").addEventListener("change", function() {
    if (this.checked) {
        adsr.connect(inputSwitch)
        micSource.disconnect()
        fileBuffer.disconnect()
    }
})

document.getElementById("fileSelect").addEventListener("change", function() {
    if (this.checked) {
        // fileBuffer.connect(inputSwitch)
        micSource.disconnect()
        adsr.disconnect()

    }
})

document.getElementById("ringMod").addEventListener("change", function() {
    if (this.checked) {
        drySig.connect(ringMod)
        ringMod.connect(wetSig)
    } else {
        drySig.disconnect(ringMod)
        ringMod.disconnect(wetSig)
    }
})

document.getElementById("dist").addEventListener("change", function() {
    if (this.checked) {

        drySig.connect(distortion)
        distortion.connect(wetSig)
    } else {
        drySig.disconnect(distortion)
        distortion.disconnect(wetSig)
    }
})

document.getElementById("delay").addEventListener("change", function() {
    if (this.checked) {
        drySig.connect(delay)
        delay.connect(wetSig)
    } else {
        drySig.disconnect(delay)
        delay.disconnect(wetSig)
    }
})


document.getElementById("playFile").addEventListener("click", function(event){
    event.preventDefault()
    loadPlayFileIntoBuffer();

})
document.getElementById("stopFile").addEventListener("click", function(event){
    event.preventDefault()
    fileBuffer.stop()

})


document.getElementById("ringModFreq").addEventListener("input", function(){
    modulationSig.frequency.setValueAtTime(parseFloat(this.value), audCtx.currentTime);
    console.log(modulationSig.frequency.value);
    document.getElementById("ringModDisplay").innerText = `${this.value} Hz`
})

document.getElementById("drive").addEventListener("input", function(){
    distortion.curve = makeDistortionCurve(parseFloat(this.value))
    document.getElementById("ringModDisplay").innerText = `${this.value} Hz`
})

document.getElementById("startAudio").addEventListener("click", function(){
    audCtx.resume()
})
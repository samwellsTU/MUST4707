import {musicTools} from "./MusicTools.js";

// Enable WebMidi API and handle any errors if it fails to enable.
// This is necessary to work with MIDI devices in the web browser.
await WebMidi.enable();
const audCtx = new (AudioContext || webkit.AudioContext)();

let myInput = WebMidi.inputs[0]

//create Nodes
//microphone input
let micSource = null; //empty variable to be populated later
let fileBuffer = null;






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
const delay = audCtx.createDelay(5.0)
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
delay.delayTime.setValueAtTime(0.25, audCtx.currentTime)
feedback.gain.setValueAtTime(0.25, audCtx.currentTime)

// Map to track active oscillators
const activeVoices = new Map();

// ADSR parameters
const attackTime = 0.02; // Attack time in seconds
const decayTime = 0.04; // Decay time in seconds
const sustainLevel = 0.7; // Sustain level (0 to 1)
const releaseTime = 2; // Release time in seconds



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
        // osc.frequency.setValueAtTime(musicTools.midiPitchToFrequency(someMIDI.note.number), audCtx.currentTime)

        startTone(someMIDI.note)
    });
    myInput.addListener("noteoff", function (someMIDI) {
        // Similarly, when a note off event is received, send a note off message to the output device.
        // This signals the end of a note being played.
        stopTone(someMIDI.note)
    });
});



 const startTone = function(note) {

     const oscillator = audCtx.createOscillator();
     const gainNode = audCtx.createGain();
     gainNode.gain.value = 0;

     // Set the frequency based on the note (simplified)
     console.log(musicTools.midiPitchToFrequency(note.number))
     oscillator.frequency.setValueAtTime(musicTools.midiPitchToFrequency(note.number), audCtx.currentTime);
     oscillator.type = 'sine';

     // Connect the oscillator to gain and gain to the context
     oscillator.connect(gainNode);
     gainNode.connect(inputSwitch);

     // Start the oscillator
     oscillator.start();
     gainNode.gain.linearRampToValueAtTime(note.attack, audCtx.currentTime + attackTime);
     gainNode.gain.linearRampToValueAtTime(note.attack*sustainLevel, audCtx.currentTime + attackTime + decayTime);
     setTimeout(()=> {
         console.log(`gain: ${gainNode.gain.value}`)
     }, (attackTime + decayTime) * 1000);

     // Add the oscillator and gainNode to the map
     activeVoices.set(note.number, {oscillator, gainNode});
    }

    const stopTone = function(note) {
        const voice = activeVoices.get(note.number);
        // console.log(activeVoices)
        if (voice) {
            // Fade out the note
            console.log(`gain: ${voice.gainNode.gain.value}`)
            voice.gainNode.gain.linearRampToValueAtTime(0., audCtx.currentTime + releaseTime);

            // Stop the oscillator after the fade
            setTimeout(() => {
                voice.oscillator.stop();
                voice.oscillator.disconnect();
                activeVoices.delete(note.number);
            }, (releaseTime+1)*1000);

            // Remove from map

        }
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

/**
 * Function to create a distortion effect for audio processing.
 * This function uses the sigmoid curve to provide a smooth transition between levels,
 * reducing the harshness of the clipping effect.
 *
 * @param {number} [amount=50] - The amount of distortion to apply. Higher values cause more distortion.
 * @returns {Float32Array} A new Float32Array filled with computed values of the distortion curve.
 */
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








/**
 * Asynchronous function to select the microphone input.
 *
 * It disconnects any existing micSource connections, enables low latency (0.02s) audio from the microphone
 * and connects the input from the micSource to the inputSwitch.
 *
 * Upon failure to access the microphone, it writes an error to the console.
 *
 * @returns {Promise<void>}
 * @throws Will throw an error if unable to access the microphone.
 */
const selectMicInput = async function() {
  try {
      //to disconnect any micSource connections
      // if (!micSource){
      //     micSource.disconnect(inputSwitch)
      // }

      //latency
      const micInput = await navigator.mediaDevices.getUserMedia({ audio: { latency: 0.02 } });

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
        inputSwitch.connect(ringMod)
        ringMod.connect(wetSig)
    } else {
        inputSwitch.disconnect(ringMod)
        ringMod.disconnect(wetSig)
    }
})

document.getElementById("dist").addEventListener("change", function() {
    if (this.checked) {
        inputSwitch.connect(distortion)
        distortion.connect(wetSig)
    } else {
        inputSwitch.disconnect(distortion)
        distortion.disconnect(wetSig)
    }
})

document.getElementById("delay").addEventListener("change", function() {
    if (this.checked) {
        inputSwitch.connect(delay)
        delay.connect(wetSig)
    } else {
        inputSwitch.disconnect(delay)
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
    document.getElementById("distDisplay").innerText = `${this.value}`
})


document.getElementById("delayTime").addEventListener("input", function(){
    delay.delayTime.linearRampToValueAtTime(parseFloat(this.value), audCtx.currentTime+0.2)
    document.getElementById("delayTimeDisplay").innerText = `${this.value} sec`
})

document.getElementById("fb").addEventListener("input", function(){
    feedback.gain.linearRampToValueAtTime(parseFloat(this.value), audCtx.currentTime+0.02)
    document.getElementById("fbDisplay").innerText = `${parseInt(this.value*100)}%`
})

// Add an 'input' event listener to the HTML element with id 'dryWet'
document.getElementById("dryWet").addEventListener("input", function(){
    // Adjust the gain (volume level) of the dry signal dynamically based on the current value of 'dryWet'
    // The 'linearRampToValueAtTime' method smoothly changes the value of the gain to the target value
    // over the specified duration (0.02 seconds from the current time in this case)
    drySig.gain.linearRampToValueAtTime(parseFloat(1-this.value), audCtx.currentTime+0.02);

    // Similarly, adjust the gain of the wet signal
    wetSig.gain.linearRampToValueAtTime(parseFloat(this.value), audCtx.currentTime+0.02);

    // Display the current value of 'dryWet' in a HTML element with id 'dryWetDisplay'
    // The value is converted to an integer percentage format for easier readability
    document.getElementById("dryWetDisplay").innerText = `${parseInt(this.value*100)}%`;
});

document.getElementById("pan").addEventListener("input", function(){
    panner.pan.linearRampToValueAtTime(parseFloat(this.value), audCtx.currentTime+0.02)
    let pos;
    if (parseFloat(this.value)>0){
        pos = `${parseInt(this.value*100)}R`
    } else if (parseFloat(this.value)<0) {
        pos =`${-1*parseInt(this.value * 100)}L`
    } else {
        pos = "C"
    }
    document.getElementById("panDisplay").innerText = `${pos}`
})

document.getElementById("vol").addEventListener("input", function(){

    volume.gain.linearRampToValueAtTime(musicTools.dbfsToLinearAmplitude(parseFloat(this.value)), audCtx.currentTime+0.02)
    document.getElementById("volDisplay").innerText = `${this.value} dBFS`
})

// Set up event listener for the "startAudio" button click event
document.getElementById("startAudio").addEventListener("click", function(){
    // Resume (or start) the audio context when the button is clicked
    audCtx.resume();
})
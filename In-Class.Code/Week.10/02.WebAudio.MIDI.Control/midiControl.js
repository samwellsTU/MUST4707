// Enable WebMidi API and handle any errors if it fails to enable.
// This is necessary to work with MIDI devices in the web browser.
await WebMidi.enable();

// Initialize variables to store the first MIDI input and output devices detected.
// These devices can be used to send or receive MIDI messages.
let myInput = WebMidi.inputs[0];

// Create a new instance of the AudioContext, allowing us to play and manipulate audio.
const myAudio = new AudioContext();

// Initialize the oscillator variable. This will later be used to generate sound waves.
let oscillator = null;



// Get the dropdown elements from the HTML document by their IDs.
// These dropdowns will be used to display the MIDI input and output devices available.
let dropIns = document.getElementById("dropdown-ins");
// For each MIDI input device detected, add an option to the input devices dropdown.
// This loop iterates over all detected input devices, adding them to the dropdown.
WebMidi.inputs.forEach(function (input, num) {
    dropIns.innerHTML += `<option value=${num}>${input.name}</option>`;
});


const mtof = function(m){
    return 440 * 2 ** ((m-69)/12)
}

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
        oscillator.frequency.setValueAtTime(mtof(someMIDI.note.number), myAudio.currentTime)
        startTone()
    });

    myInput.addListener("noteoff", function (someMIDI) {
        // Similarly, when a note off event is received, send a note off message to the output device.
        // This signals the end of a note being played.
        stopTone()
    });
});



// Get the gain control slider from the document by its ID.
const gainControl = document.getElementById("gainSlider")

// Create a GainNode for the ADSR envelope, initially set to silent (gain = 0).
const adsrNode = myAudio.createGain()

// Create another GainNode for controlling the master volume of the sound.
const gainNode = myAudio.createGain()

// Set the initial gain (volume) for the ADSR node to 0, muting it.
adsrNode.gain.value = 0.

// Connect the ADSR node to the gain node.
adsrNode.connect(gainNode)

// Connect the gain node to the destination of the AudioContext, typically the speakers.
gainNode.connect(myAudio.destination)

// Set the initial gain (volume) for the gain node to 0, muting it.
gainNode.gain.value = 0.

// Create an oscillator for generating sound waves and connect it to the ADSR node.
oscillator = myAudio.createOscillator()
oscillator.connect(adsrNode)

// Set the waveform type of the oscillator to "square".
oscillator.type = "square"

// Set the frequency of the oscillator to 110 Hz at the current audio context time.
oscillator.frequency.setValueAtTime(110, myAudio.currentTime)

// Start generating sound waves immediately.
oscillator.start()








// Define the function to start the tone.
const startTone = function() {

    adsrNode.gain.linearRampToValueAtTime(1.0, myAudio.currentTime + 0.1)
}

// Define the function to stop the tone.
const stopTone = function() {
    // Log the current gain value of the ADSR node for debugging.
    // console.log(adsrNode.gain.value)

    // Ramp down the gain of the ADSR node to 0 over 2 seconds for the fade-out effect.
    adsrNode.gain.linearRampToValueAtTime(0., myAudio.currentTime + 1.0)
}

// Define the function to update the gain based on the slider's value.
const updateGain = function() {
    // Resume the AudioContext in case it was suspended.
    myAudio.resume()

    // Get the current value of the gain slider, convert it to a floating-point number.
    let sliderVal = parseFloat(gainControl.value)

    // Display the current slider value in dBFS (Decibels relative to Full Scale).
    document.getElementById("gainDisplay").innerText = `${sliderVal} dBFS`

    // Convert the dBFS value to linear amplitude and set it as the gain node's value.
    let linAmp = 10**(sliderVal/20)
    gainNode.gain.setValueAtTime(linAmp, myAudio.currentTime);
}



// Attach an event listener to the gain control slider to update the gain in real-time.
gainControl.addEventListener("input", updateGain)

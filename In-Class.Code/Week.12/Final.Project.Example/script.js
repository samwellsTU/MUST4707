/**
 * @file This is a web application that serves as a synthesizer or FX machine.
 * It allows users to select various input sources (MIDI, Microphone, Synth, or a File) and apply different effects
 * (Ring Modulation, Distortion, Delay) with live audio processing. Users can interact with UI elements to control
 * various aspects of the input sources and effects parameters. The audio output parameters such as dry/wet mix,
 * panning, and volume can also be controlled from the user interface. The application utilizes the Web MIDI API
 * provided by the WebMidi.js library to handle MIDI functionalities in the web browser.
 */

/**
 * @module This module handles the various functionalities for a synthesizer or FX machine web application
 * using the WebMidi.js library to provide MIDI functionalities, and the Web Audio API for audio processing.
 * The module creates audio nodes, handles routing that will not change, sets initial parameters for the
 * audio effects, adds event listeners for user interactions and also maps active oscillators for ADSR parameters.
 */

// Import the necessary tools from the MusicTools.js module
import {musicTools} from "./MusicTools.js";

// Enable WebMidi API and handle any errors if it fails to enable.
// This is necessary to work with MIDI devices in the web browser.
// 'await' is used here because enabling the WebMidi API is an asynchronous operation.
await WebMidi.enable();

// Create a new AudioContext object.
// The Web Audio API uses the AudioContext interface to create nodes which represent audio sources,
// the audio destination, and intermediary processing modules.
// These modules can be linked together to form a modular audio routing graph.
const audCtx = new (AudioContext || webkit.AudioContext)();

// Define your input from the available MIDI inputs, for instance, the first one.
let myInput = WebMidi.inputs[0];


// Initialize nodes for audio input and buffer.
let micSource = null; // 'micSource' will be used to handle microphone input.
let fileBuffer = null; // 'fileBuffer' will be used to store audio file data.

// Initialize gain nodes for handling different parts of the audio signal.
const inputSwitch = audCtx.createGain(); // 'inputSwitch' will control input signal level.
const drySig = audCtx.createGain(); // 'drySig' will control the level of unprocessed signal.
const wetSig = audCtx.createGain(); // 'wetSig' will control the level of processed signal.
const panner = audCtx.createStereoPanner() // 'panner' is a StereoPanner node to control audio pan position.
const volume = audCtx.createGain(); // 'volume' will control the output volume level.

// Initialize the FX nodes.
const modulationSig = audCtx.createOscillator() // 'modulationSig' Oscillator node for ring modulation frequency.
const ringMod = audCtx.createGain(); // 'ringMod' Gain node for ring modulation.
const distortion = audCtx.createWaveShaper() // 'distortion' WaveShaper node for distortion effect.
const delay = audCtx.createDelay(5.0) // 'delay' Delay node for delay effect.
const feedback = audCtx.createGain(); // 'feedback' Gain node for feedback level of delay effect.

// Configure static routing for nodes.
inputSwitch.connect(drySig);
drySig.connect(panner);
wetSig.connect(panner);
panner.connect(volume);
volume.connect(audCtx.destination);
delay.connect(feedback);
feedback.connect(delay);

// Connect the modulation oscillator for the ring modulation effect.
modulationSig.connect(ringMod.gain);
modulationSig.start() // Start the modulation oscillator.

// Set initial parameters for delay effect.
delay.delayTime.setValueAtTime(0.25, audCtx.currentTime); // Set initial delay time.
feedback.gain.setValueAtTime(0.25, audCtx.currentTime); // Set initial delay feedback level.

// Initialize Map to track active oscillators for handling MIDI note scheduling.
const activeVoices = new Map();

// Set length (in seconds) for Attack-Decay-Sustain-Release (ADSR) envelope segments.
const attackTime = 0.02; // Attack time in seconds
const decayTime = 0.04; // Decay time in seconds
const sustainLevel = 0.7; // Sustain level (0 to 1)
const releaseTime = 2; // Release time in seconds


//FUNCTION DEFINITIONS

/**
 * This function starts playing a tone given a MIDI note
 * @param {object} note - The MIDI note to play
 */
const startTone = function(note) {

    // Create an oscillator node and a gain node in the audio context
    const oscillator = audCtx.createOscillator();
    const gainNode = audCtx.createGain();

    // Initialize the gain value to 0
    gainNode.gain.value = 0;

    // Convert the MIDI note number into frequency using the `musicTools` library's `midiPitchToFrequency` function
    // and set the oscillator frequency to the result
    console.log(musicTools.midiPitchToFrequency(note.number));
    oscillator.frequency.setValueAtTime(musicTools.midiPitchToFrequency(note.number), audCtx.currentTime);

    // Set the oscillator waveform type to 'sine'
    oscillator.type = 'sine';

    // Connect the oscillator node to the gain node, and the gain node to the inputSwitch node
    oscillator.connect(gainNode);
    gainNode.connect(inputSwitch);

    // Start the oscillator, and perform an attack/decay operation to shape the note's volume envelope
    oscillator.start();
    gainNode.gain.linearRampToValueAtTime(note.attack, audCtx.currentTime + attackTime);
    gainNode.gain.linearRampToValueAtTime(note.attack*sustainLevel, audCtx.currentTime + attackTime + decayTime);

    // Log the gain value after the decay has finished
    setTimeout(()=> {
        console.log(`gain: ${gainNode.gain.value}`)
    }, (attackTime + decayTime) * 1000);

    // Add the oscillator and gain node to the activeVoices map, with the note number as the key
    activeVoices.set(note.number, {oscillator, gainNode});
}

/**
 * This function stops playing a tone given a MIDI note.
 * @param {object} note - The MIDI note to stop.
 */
const stopTone = function(note) {
    // Retrieve the active voice (oscillator and gain) for the given note number.
    const voice = activeVoices.get(note.number);

    // Check if there's an active voice for the note.
    if (voice) {
        // Log the current gain value of the note.
        console.log(`gain: ${voice.gainNode.gain.value}`)

        // Gradually reduce the gain of the note's gain node to 0,
        // effectively creating a 'release' envelope stage.
        voice.gainNode.gain.linearRampToValueAtTime(0., audCtx.currentTime + releaseTime);

        // Schedule the oscillator to stop after the 'release' stage is done.
        setTimeout(() => {
            // Stop the oscillator.
            voice.oscillator.stop();

            // Disconnect the oscillator to aid garbage collection and free up audio resources.
            voice.oscillator.disconnect();

            // Remove the oscillator and gain node from the activeVoices map.
            activeVoices.delete(note.number);
        }, (releaseTime + 1) * 1000);
    }
}




/**
 * This function loads and plays an audio file available from a file input element.
 */
const loadPlayFileIntoBuffer = function() {
    // Locate the file input element and get its first selected file
    let fileLoad = document.getElementById("uploadFile");
    let file = fileLoad.files[0];

    // If no file has been selected, log an error and exit the function
    if (!file) {
        console.log("No file selected");
        return;
    }

    // Create a new FileReader object
    let fileReader = new FileReader();

    // Set up a function to run when the file has been loaded
    fileReader.onload = function (event) {
        // Create a new buffer for the audio file
        fileBuffer = audCtx.createBufferSource();

        // Decode the audio data from the file
        audCtx.decodeAudioData(event.target.result, function(buffer) {
            // When the data is successfully decoded, set the buffer as the source of the audio file
            fileBuffer.buffer = buffer;

            console.log("Buffer loaded into fileBuffer");

            // Connect the audio to the input switch gain node
            fileBuffer.connect(inputSwitch);

            // Start playing the audio
            fileBuffer.start();
        }, function(err) {
            // If the audio data could not be decoded, log an error
            console.log("Error decoding audio data", err);
        });
    };

    // Begin reading the file as an array buffer
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
    // `k` is the amount of distortion. If `amount` is a number, use it, otherwise use 50.
    const k = typeof amount === "number" ? amount : 50;
    // Set a standard sample rate
    const n_samples = 44100;
    // Create a new Float32Array to store the grahp of the distortion.
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;

    // For each sample...
    for (let i = 0; i < n_samples; i++) {
        // Calculate the x value. ive values range from -1 to 1.
        const x = (i * 2) / n_samples - 1;
        // Calculate the y value using the transfer function of the waveshaper
        // This is what distorts the waveform
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    // return the curve so that it can be used by a WaveShaperNode in an AudioContext
    return curve;
};


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
        // Setup a media stream constraint object with low latency settings
        const audioConstraints = { audio: { latency: 0.02 } };

        // Access the user's media device(microphone)
        const micInput = await navigator.mediaDevices.getUserMedia(audioConstraints);

        // Create a new MediaStreamAudioSourceNode using the microphone input stream
        micSource = audCtx.createMediaStreamSource(micInput);

        // Connect the microphone source to the 'inputSwitch' node for further audio processing
        micSource.connect(inputSwitch)

    } catch (err) {
        // If an error occurs while accessing microphone, log it to the console
        console.error('Error accessing the microphone:', err);
    }
}





//MIDI INPUT UI

// Get the dropdown elements from the HTML document by their IDs.
// These dropdowns will be used to display the MIDI input and output devices available.
let dropIns = document.getElementById("dropIns");

// Loop through each input device in the WebMidi.inputs array
WebMidi.inputs.forEach(function (input, num) {

    // For each input device, an option is added to the dropIns HTML select element
    // The value of the option will be the index number of the device (num) and the display label will be the device's name (input.name)
    dropIns.innerHTML += `<option value=${num}>${input.name}</option>`;
});



//EVENT LISTENERS

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


// Getting HTML Element by ID, this is typically a checkbox input
let micSelectElement = document.getElementById("micSelect");

// Adding an event listener to the checkbox for the 'change' event
// The 'change' event is fired when the state of a control changes such as when a checkbox is checked (or unchecked)
micSelectElement.addEventListener("change", function() {
    // 'this' here refers to the checkbox that fired the event
    // If the checkbox is checked...
    if (this.checked) {
        // Log a message to the console
        console.log("mic");

        // Call the 'selectMicInput' function to switch the input to microphone
        selectMicInput();

        // Disconnect the 'adsr' node from its destination to stop its audio processing
        adsr.disconnect();

        // Disconnect the 'fileBuffer' node from its destination to stop its audio processing
        fileBuffer.disconnect();
    }
});

// Reference to the HTML Element with the ID 'synthSelect', this is typically a checkbox input
let synthSelectElement = document.getElementById("synthSelect");

// Adding an event listener for the 'change' event to the 'synthSelect' checkbox
// The 'change' event is fired for <input>, <select>, and <textarea> elements when a change to the element’s value is committed by the user
synthSelectElement.addEventListener("change", function() {
    // 'this' here refers to the checkbox that fired the 'change' event
    // If the checkbox is checked...
    if (this.checked) {
        // Disconnect the 'micSource' node from its destinations to stop processing its audio input
        micSource.disconnect();

        // Disconnect the 'fileBuffer' node from its destinations to stop processing its audio input
        fileBuffer.disconnect();
    }
});

// Get the checkbox HTML Element by ID 'fileSelect'
let fileSelectElement = document.getElementById("fileSelect");

// Add an event listener for the 'change' event to 'fileSelect' checkbox
// The 'change' event is fired when the state of a control changes
// In this case, it's fired when checkbox status changes (checked/unchecked)
fileSelectElement.addEventListener("change", function() {
    // Here 'this' refers to the object that fired the event, in this case, fileSelect checkbox
    // If the checkbox is checked...
    if (this.checked) {
        // A commented line of code that connects the 'fileBuffer' to 'inputSwitch' node
        // Uncommenting it may send the 'fileBuffer' as an input source to the 'inputSwitch'
        // fileBuffer.connect(inputSwitch)

        // Disconnect 'micSource' from its connected node to stop processing its inputs
        micSource.disconnect()

        // Disconnect 'adsr' from its connected node to stop processing its inputs
        adsr.disconnect()
    }
});

// Getting reference to the HTML Element with the ID 'ringMod', typically a checkbox input
let ringModElement = document.getElementById("ringMod");

// Adding an event listener for the 'change' event to the 'ringMod' checkbox
// The 'change' event is fired when the state of a control changes (e.g., checking/unchecking a checkbox)
ringModElement.addEventListener("change", function() {
    // 'this' here refers to the 'ringMod' checkbox that fired the 'change' event
    // Checking if the checkbox is checked...
    if (this.checked) {
        // If it is checked:
        // Connect the 'inputSwitch' to the 'ringMod' node
        // This might send the audio signal to the ring modulation function
        inputSwitch.connect(ringMod);

        // Connect the 'ringMod' node to the 'wetSig' node
        // This might send the ring modulated signal to the wet signal
        ringMod.connect(wetSig);
    } else {
        // If it is not checked:
        // Disconnect the 'inputSwitch' from the 'ringMod' node
        // This stops sending the audio signal to the ring modulation function
        inputSwitch.disconnect(ringMod);

        // Disconnect the 'ringMod' node from the 'wetSig' node
        // This stops sending the ring modulated signal to the wet signal
        ringMod.disconnect(wetSig);
    }
});

// Obtain a reference to the HTML Element ID 'dist', typically a checkbox input
let distElement = document.getElementById("dist");

// Add an event listener for the 'change' event on 'dist' checkbox
// The 'change' event is triggered when the user interacts with the checkbox (checks/unchecks)
distElement.addEventListener("change", function() {
    // 'this' refers to the checkbox that fired the event
    // If the checkbox is checked...
    if (this.checked) {
        // Connect the 'inputSwitch' to 'distortion' node
        // This suggests that the original audio signal is directed to a distortion
        inputSwitch.connect(distortion);

        // Then, connect the 'distortion' node to 'wetSig' node
        // The distorted audio signal is now directed to the 'wetSig'
        distortion.connect(wetSig);
    } else {
        // If the checkbox is not checked (i.e., unchecked)...

        // Disconnect 'inputSwitch' from 'distortion' node
        // This stops the original audio signal from being sent to the distortion
        inputSwitch.disconnect(distortion);

        // Then, disconnect the 'distortion' node from the 'wetSig' node
        // This stops the distorted audio signal from being sent to the 'wetSig'
        distortion.disconnect(wetSig);
    }
});

// Obtain a reference to the HTML Element with the ID 'delay', typically a checkbox input
let delayElement = document.getElementById("delay");

// Add an event listener for the 'change' event on this 'delay' checkbox
// The 'change' event is triggered when the state of the checkbox changes (i.e., checked or unchecked)
delayElement.addEventListener("change", function() {
    // 'this' refers to the checkbox that triggered the 'change' event
    // Check if the checkbox is marked as checked...
    if (this.checked) {
        // If checked:

        // Connect the 'inputSwitch' node to the 'delay' node
        // This implies that the audio signal is directed into a delay function
        inputSwitch.connect(delay);

        // Connect the 'delay' node to the 'wetSig' node
        // The delayed audio signal is now directed into the 'wetSig'
        delay.connect(wetSig);
    } else {
        // If the checkbox is not checked (i.e., unchecked):

        // Disconnect 'inputSwitch' from 'delay'
        // This stops the audio signal from being fed into the delay function
        inputSwitch.disconnect(delay);

        // Disconnect the 'delay' from the 'wetSig'
        // This stops the delayed audio signal from being sent to the 'wetSig'
        delay.disconnect(wetSig);
    }
});

// Obtain a reference to the HTML Element with the ID 'playFile', typically a button.
let playFileElement = document.getElementById("playFile");

// Add an event listener for the 'click' event on this 'playFile' button
// The 'click' event is triggered when the user clicks the button
playFileElement.addEventListener("click", function(event) {
    // The 'event' object refers to the ClickEvent that happened

    // Call 'preventDefault' method to prevent the browser's default click action
    // This is commonly used when implementing custom click behavior
    event.preventDefault();

    // Call the custom function 'loadPlayFileIntoBuffer'
    // This function likely loads a file into a buffer and plays it. The details would depend on its implementation
    loadPlayFileIntoBuffer();
});
// Obtain a reference to the HTML Element with the ID 'stopFile', typically a button.
let stopFileElement = document.getElementById("stopFile");

// Add an event listener for the 'click' event on the 'stopFile' button
// The 'click' event is triggered when the user clicks the button
stopFileElement.addEventListener("click", function(event) {
    // The 'event' object refers to the ClickEvent that happened

    // Call 'preventDefault' to stop the browser's default click action
    // This is usually done when you're implementing a custom click behavior
    event.preventDefault();

    // Call the 'stop' method on the 'fileBuffer' object
    // This likely stops the audio playback that's currently going on
    fileBuffer.stop();
});


// Obtain a reference to the HTML Element with the ID 'ringModFreq', typically a range/slider input
let ringModFreqElement = document.getElementById("ringModFreq");

// Add an event listener for the 'input' event on this 'ringModFreq' slider
// The 'input' event is triggered every time the user changes the slider's value
ringModFreqElement.addEventListener("input", function() {
    // 'this' refers to the slider that triggered the 'input' event

    // Set the frequency of the 'modulationSig' to the current slider value
    // Convert the value to a number using parseFloat, as the value property of an input element is always a string
    // The 'setValueAtTime' function is generally used to schedule a parameter change at a specific time
    // Here it changes the frequency immediately, as the time is set to the current time in the audio context (audCtx.currentTime)
    modulationSig.frequency.setValueAtTime(parseFloat(this.value), audCtx.currentTime);

    // Log the current frequency value of the 'modulationSig' to the console
    console.log(modulationSig.frequency.value);

    // Update the inner text of the HTML Element with the ID 'ringModDisplay' in real-time with the slider value
    // The inner text string is set to display the value in Hertz
    document.getElementById("ringModDisplay").innerText = `${this.value} Hz`
});

// Obtain a reference to the HTML Element with the ID 'drive', usually a range/slider input
let driveElement = document.getElementById("drive");

// Add an event listener for the 'input' event on this 'drive' slider
// The 'input' event is triggered whenever the user changes the slider's value
driveElement.addEventListener("input", function() {
    // 'this' refers to the slider that has triggered the 'input' event

    // Set the 'curve' property of the 'distortion' object to the returned value from 'makeDistortionCurve' function.
    // Pass the current selected value of the slider (converted to a number using parseFloat) to this function
    // It's likely that the 'makeDistortionCurve' function generates a wave shaping curve for distortion effects
    // The more the 'drive' the more will be the distortion
    distortion.curve = makeDistortionCurve(parseFloat(this.value));

    // Update the inner text of the HTML Element with the ID 'distDisplay' with the current slider value in real time
    document.getElementById("distDisplay").innerText = `${this.value}`;
});


// Obtain a reference to the HTML Element with the ID 'delayTime', typically a range/slider input
let delayTimeElement = document.getElementById("delayTime");

// Add an event listener for the 'input' event on the 'delayTime' slider
// The 'input' event is triggered every time a user changes the slider's value
delayTimeElement.addEventListener("input", function() {
    // 'this' refers to the slider that has triggered the 'input' event

    // Using the 'linearRampToValueAtTime' function, gradually changes the 'delayTime' property value of 'delay' object
    // The new value is the current slider value (converted to a number using parseFloat)
    // This function applies a ramp to the target value over a particular time duration, here the duration is 0.2 second from now.
    delay.delayTime.linearRampToValueAtTime(parseFloat(this.value), audCtx.currentTime + 0.2);

    // Update the inner text of the HTML Element having the ID 'delayTimeDisplay' with the current slider value in real-time
    // The updated value indicates the delay time in seconds
    document.getElementById("delayTimeDisplay").innerText = `${this.value} sec`;
});

// Obtain a reference to the HTML Element with the ID 'fb', typically a range/slider input
let feedbackElement = document.getElementById("fb");

// Add an event listener for the 'input' event on the 'fb' slider
// The 'input' event is triggered every time a user changes the slider's value
feedbackElement.addEventListener("input", function() {
    // 'this' refers to the slider that has triggered the 'input' event

    // Using the 'linearRampToValueAtTime' function, gradually changes the 'gain' property value of 'feedback' object
    // The new value is the current slider value (converted to a number using parseFloat)
    // This function applies a ramp to the target value over a particular time duration, here the duration is 0.02 second from now.
    feedback.gain.linearRampToValueAtTime(parseFloat(this.value), audCtx.currentTime + 0.02);

    // Update the inner text of the HTML Element having the ID 'fbDisplay' with the current slider value in real time
    // The updated value indicates the feedback gain in percentage, parseInt is used to convert the value to an integer
    document.getElementById("fbDisplay").innerText = `${parseInt(this.value*100)}%`;
});

// Obtain a reference to the HTML Element with the ID 'dryWet', typically a range/slider input
let dryWetElement = document.getElementById("dryWet");

// Add an event listener for the 'input' event on the 'dryWet' slider
// The 'input' event is triggered every time the user changes the value of the slider
dryWetElement.addEventListener("input", function() {
    // 'this' refers to the slider that has triggered the 'input' event

    // The 'linearRampToValueAtTime' function is called on the 'gain' property of 'drySig' object,
    // Gradually changing its value to the target value, which is (1 - the current value of 'dryWet' slider)
    // The function applies a ramp to the target value over a certain time duration, here the duration is 0.02 seconds from the current audio context time
    drySig.gain.linearRampToValueAtTime(parseFloat(1 - this.value), audCtx.currentTime + 0.02);

    // Similarly, gradually change the 'gain' property value of 'wetSig' object
    // The target value is equal to the current value of 'dryWet' slider
    wetSig.gain.linearRampToValueAtTime(parseFloat(this.value), audCtx.currentTime + 0.02);

    // Update the inner text of the HTML Element with the ID 'dryWetDisplay' with the current value of 'dryWet' slider
    // The value is first converted to a percentage (by multiplying by 100) and then to an integer for easier readability
    document.getElementById("dryWetDisplay").innerText = `${parseInt(this.value * 100)}%`;
});

// Obtain a reference to the HTML Element with the ID 'pan', usually a range/slider input
let panElement = document.getElementById("pan");

// Add an event listener for the 'input' event on the 'pan' slider
// The 'input' event is triggered whenever the user changes the value of the slider
panElement.addEventListener("input", function() {
    // 'this' refers to the slider that has triggered the 'input' event

    // Gradually change the 'pan' property value of 'panner' object using the 'linearRampToValueAtTime' function
    // The new value is the current value of the slider (converted to a number using parseFloat)
    // This function applies a ramp to the target value over a certain time duration, here the duration is 0.02 second from the current audio context time
    panner.pan.linearRampToValueAtTime(parseFloat(this.value), audCtx.currentTime + 0.02);

    // Declare a variable 'pos' to hold the position information
    let pos;

    // If the slider value is greater than 0, set position to a percentage indicating Right
    if (parseFloat(this.value) > 0) {
        pos = `${parseInt(this.value * 100)}R`;
    }
    // If the slider value is less than 0, set position to a percentage indicating Left
    else if (parseFloat(this.value) < 0) {
        pos = `${-1 * parseInt(this.value * 100)}L`;
    }
    // If the slider value is exactly 0, set position to Center
    else {
        pos = "C";
    }

    // Update the inner text of the HTML element with the ID 'panDisplay' to the value of 'pos'
    document.getElementById("panDisplay").innerText = `${pos}`;
});

// Obtain a reference to the HTML element with the ID 'vol', typically a range/slider input
let volumeElement = document.getElementById("vol");

// Add an event listener for the 'input' event on the 'vol' slider
// The 'input' event is triggered every time a user changes the slider's value
volumeElement.addEventListener("input", function() {
    // 'this' refers to the slider that has triggered the 'input' event

    // Use the 'linearRampToValueAtTime' function to change the 'gain' value of 'volume' object smoothly over time
    // The target value is the current slider value (which is in dBFS, Decibels Full Scale, and is converted to linear amplitude using a function from the 'musicTools' object)
    // The change happens over a duration of 0.02 seconds from the current audio context time
    volume.gain.linearRampToValueAtTime(musicTools.dbfsToLinearAmplitude(parseFloat(this.value)), audCtx.currentTime + 0.02);

    // Update the inner text of the HTML Element with the ID 'volDisplay' to display the current slider value (in dBFS)
    document.getElementById("volDisplay").innerText = `${this.value} dBFS`;
});
// Access the HTML element with the ID 'startAudio', usually a button
let startAudioButton = document.getElementById("startAudio");

// Add an event listener for the 'click' event on the 'startAudio' button
// The 'click' event is triggered whenever the button is clicked by the user
startAudioButton.addEventListener("click", function() {

    // 'audCtx' is assumed to be an instance of AudioContext, which represents an audio-processing graph
    // The 'resume' method is used to reinitiate the audio context state and restart the audio processes

    audCtx.resume();
});
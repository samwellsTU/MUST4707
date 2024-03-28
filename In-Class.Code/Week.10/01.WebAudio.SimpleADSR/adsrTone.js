// Create a new instance of the AudioContext, allowing us to play and manipulate audio.
const myAudio = new AudioContext();

// Initialize the oscillator variable. This will later be used to generate sound waves.
let oscillator = null;

// Get the start and stop buttons from the HTML document by their IDs.
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");

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
    // Recreate the oscillator and set it up to start the tone again.
    oscillator = myAudio.createOscillator()
    oscillator.connect(adsrNode)
    oscillator.type = "square"
    oscillator.frequency.setValueAtTime(110, myAudio.currentTime)
    oscillator.start()

    // Ramp up the gain of the ADSR node to 1 over 2 seconds for the fade-in effect.
    adsrNode.gain.linearRampToValueAtTime(1.0, myAudio.currentTime + 2)
}

// Define the function to stop the tone.
const stopTone = function() {
    // Log the current gain value of the ADSR node for debugging.
    console.log(adsrNode.gain.value)

    // Ramp down the gain of the ADSR node to 0 over 2 seconds for the fade-out effect.
    adsrNode.gain.linearRampToValueAtTime(0., myAudio.currentTime + 2)
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

// Attach event listeners to the start and stop buttons to trigger the respective functions.
startButton.addEventListener("click", startTone);
stopButton.addEventListener("click", stopTone)

// Attach an event listener to the gain control slider to update the gain in real-time.
gainControl.addEventListener("input", updateGain)

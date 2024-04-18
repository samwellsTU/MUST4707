/**
 * @file This script is for the purpose of handling user interactions in relation to audio file processing.
 * It attaches event listeners to several buttons ("loadFile", "rms", "peak") in the HTML document.
 * Each event listener triggers a specific action when the associated button is clicked:
 * - "loadFile": Resumes the audio context (if necessary) and initiates a file loading process into the audio buffer.
 * - "rms": Calculates the RMS (Root Mean Square) of the audio buffer in linear amplitudes, calculates the peak amplitude, and displays the RMS in dBFS (decibels full scale).
 * - "peak": Calculates the linear amplitude of the peak sound level and displays the peak amplitude in dBFS.
 * The results of these calculations are used to update specific HTML elements with the calculated values.
 */

// Create an instance of AudioContext.
// The AudioContext interface represents an audio-processing graph built from audio modules linked together.
// Each module corresponds to an AudioNode. An audio context controls both the creation of the nodes it contains and the execution of the audio processing, or decoding.
const myAudio = new AudioContext();

// Declare a variable 'fileBuffer' which is undefined initially.
// This variable can later be assigned a value, likely an Audio Buffer. An Audio Buffer represents a short audio clip.
// A Buffer can be played with an AudioBufferSourceNode.
let fileBuffer;


/**
 * Converts a linear amplitude value to decibels.
 *
 * @param {number} linAmp - The linear amplitude to convert.
 * @returns {number} The converted amplitude in decibels.
 */
const atodb = function(linAmp) {
    return 20 * Math.log(linAmp);
}

/**
 * Loads selected file into a buffer for audio processing.
 * Uses the File API to read the file, and the Web Audio API to decode and use the audio data.
 */
const loadFileIntoBuffer = function() {
    // Get the file input DOM element from the page.
    let fileLoad = document.getElementById("uploadFile");

    // Get the actual File object from the file input.
    // The files property is a FileList, but we only care about the first File in the list.
    let file = fileLoad.files[0];

    // If no file was selected, log an error message and end the function early.
    if (!file) {
        console.log("No file selected");
        return;
    }

    // Create a FileReader to read the file data.
    let fileReader = new FileReader();

    // Once the file is loaded, this code will run...
    fileReader.onload = function (event) {
        // Creating a BufferSource to hold our audio data.
        fileBuffer = myAudio.createBufferSource();

        // Decode the audio data from the file into our buffer using AudioContext's decodeAudioData.
        myAudio.decodeAudioData(event.target.result, function(buffer) {
            // If successful, the decoded audio data is placed into our buffer.
            fileBuffer.buffer = buffer;
            console.log("Buffer loaded into fileBuffer");

            // If the decoding fails, an error message will be logged.
        }, function(err) {
            console.error("Error decoding audio data", err);
        });
    };

    // Start reading the file as an ArrayBuffer. Once it's done, it will trigger the onload event.
    fileReader.readAsArrayBuffer(file);
}

/**
 * Calculates the Root Mean Square (RMS) of an audio buffer.
 *
 * @param {AudioBufferSourceNode} audioBuffer - The audio buffer to analyze.
 * @returns {number} The RMS value of the audio buffer.
 */
const calculateRMS = function(audioBuffer){
    // Gets the first channel of audio data.
    // In a mono audio file, there is only one channel, and in a stereo file, typically the left channel is 0 and the right is 1.
    let channelData = audioBuffer.buffer.getChannelData(0);

    // Initializes a variable to store the sum of squares of all audio samples.
    let sumOfSqaures = 0;

    // For each audio sample in the channel data...
    channelData.forEach(function(sample){
        // Square the sample's amplitude and add it to the sum of squares.
        sumOfSqaures += sample * sample;
    })

    // Calculates the average of the sum of squares by dividing it by the total number of samples.
    let average = sumOfSqaures / channelData.length;

    // Finds the square root of the average to get the RMS.
    let rms = Math.sqrt(average);

    // Returns the RMS value.
    return rms;
}


/**
 * Calculates the peak amplitude of an audio buffer.
 *
 * @param {AudioBufferSourceNode} audioBuffer - An audio buffer.
 * @returns {number} The peak amplitude of the audio buffer.
 */
const peakAmp = function(audioBuffer) {

    // Define a variable to hold the peak amplitude.
    let peak = 0;

    console.log(audioBuffer.buffer.numberOfChannels);

    // Loop over each available channel (0 for left and 1 for right in a stereo signal)
    for(let c = 0; c < audioBuffer.buffer.numberOfChannels; c++) {

        // Get the data for the current channel
        let channelData = audioBuffer.buffer.getChannelData(c);

        // For each sample in the channel data
        channelData.forEach(function(sample) {

            // Get the absolute value of the sample, since we're interested in peak amplitude, not peak deviation in either direction
            let posSamp = Math.abs(sample);

            // If the absolute value of the sample is greater than our current peak, replace it
            if (posSamp > peak) {
                peak = posSamp;
            }
        });
    }

    // Return the peak amplitude
    return peak;
}
// Attach a click event listener to the HTML element with the ID "loadFile".
// When a user clicks this element, the function given here will be called.
document.getElementById("loadFile").addEventListener("click", ()=>{

    // Resume the audio context.
    // The Web Audio API requires us to call resume() on a user gesture,
    // like a click or a key press, before we can start outputting sound.
    myAudio.resume();

    // Call the function to load a file into the audio buffer.
    // This will prompt the user to select a file, and then load that file into an AudioBuffer for playback.
    loadFileIntoBuffer();
});

// Attach a click event listener to the HTML element with the ID "rms".
// When a user clicks this element, the function given here will be executed.
document.getElementById("rms").addEventListener("click", ()=>{

    // Call the calculateRMS function with the current file buffer as an argument to calculate the Root Mean Square (RMS) in linear amplitudes.
    // Store the linear amplitude RMS value in the rmsLin variable.
    let rmsLin = calculateRMS(fileBuffer);

    // Call the peakAmp function which calculates the peak amplitude of the sound file.
    // At the moment, the result isn't stored anywhere, so it essentially gets ignored.
    // However, this could be stored in a variable if further processing or utilization is needed.
    peakAmp(fileBuffer);

    // Convert the linear RMS amplitude to decibels full scale (dBFS).
    // dBFS is a unit of measurement for audio levels normalized to digital full scale, where '0 dBFS' corresponds to the maximum possible digital level.
    // Then, update the "rmsresult" HTML element with the calculated dBFS value.
    document.getElementById("rmsresult").innerText = `${atodb(rmsLin)} dBFS`;

});

// Attach a click event listener to the HTML element with the ID "peak".
// When a user clicks this element, the function given here will be executed.
document.getElementById("peak").addEventListener("click", ()=>{

    // Call the peakAmp function with the current file buffer as an argument to calculate the linear amplitude of the peak sound level.
    // Store this peak linear amplitude in the variable peakLin.
    let peakLin = peakAmp(fileBuffer);

    // Convert the linear peak amplitude to decibels full scale (dBFS).
    // dBFS is an audio level measurement where '0 dBFS' corresponds to the highest possible digital level.
    // Update the HTML element with the ID "peakresult" with the calculated dBFS value.
    document.getElementById("peakresult").innerText = `${atodb(peakLin)} dBFS`;
});
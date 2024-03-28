// Initialize the AudioContext, which is necessary for any audio operation.
const ac = new (AudioContext || webkitURL.AudioContext)();

// Function to fetch the audio file.
const getAudioFile = async function (url) {
  // Fetch the audio file from the given URL.
  const response = await fetch(url);
  // Convert the fetched data into an ArrayBuffer.
  const arrayBuffer = await response.arrayBuffer();
  return arrayBuffer;
};

// Function to decode the fetched audio data.
const decodeAudioData = async function (audioContext, arrayBuffer) {
  // Decode the ArrayBuffer into an AudioBuffer using the AudioContext.
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer;
};
// Function to play the decoded audio data.
const playAudio = function (audioContext, audioBuffer) {
  // Create a BufferSource node, which is used to play the audio data.
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer; // Assign the decoded audio data to the source.
  source.connect(audioContext.destination); // Connect the source to the AudioContext's output (the speakers).
  source.start(); // Start playing the audio.
};

// Fetch and decode the audio file (e.g., "organ.wav").
const fileData = await getAudioFile("./organ.wav");

const audioBuffer = await decodeAudioData(ac, fileData);

// Attach an event listener to the "Play" button.
document.getElementById("play").addEventListener("click", function () {
  ac.resume(); // Ensure the AudioContext is running.
  playAudio(ac, audioBuffer); // Play the audio when the button is clicked.
});

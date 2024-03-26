 const myAudio = new AudioContext();
let oscillator = null;
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");

const startTone = function() {
    myAudio.resume()
    oscillator = myAudio.createOscillator()
    oscillator.connect(myAudio.destination)
    oscillator.type = "sawtooth"
    oscillator.frequency.setValueAtTime(110, myAudio.currentTime)
    oscillator.start()
}

const stopTone = function() {
    oscillator.stop()
}

startButton.addEventListener("click", startTone);
stopButton.addEventListener("click", stopTone)



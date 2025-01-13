const myAudio = new AudioContext();
let oscillator = null;
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gainControl = document.getElementById("gainSlider")
const gainNode = myAudio.createGain()
gainNode.connect(myAudio.destination)
gainNode.gain.value = 0. //linear amplitude

const startTone = function() {
    myAudio.resume()
    oscillator = myAudio.createOscillator()
    oscillator.connect(gainNode)
    oscillator.type = "sawtooth"
    oscillator.frequency.setValueAtTime(110, myAudio.currentTime)
    oscillator.start()
}

const stopTone = function() {
    oscillator.stop()
}

const updateGain = function() {
    myAudio.resume()
    let sliderVal = parseFloat(gainControl.value)
    document.getElementById("gainDisplay").innerText = `${sliderVal} dBFS`
    let linAmp = 10**(sliderVal/20)
    console.log(sliderVal, linAmp)
    gainNode.gain.setValueAtTime(linAmp, myAudio.currentTime);
    console.log(gainNode.gain.value)
}

startButton.addEventListener("click", startTone);
stopButton.addEventListener("click", stopTone)
gainControl.addEventListener("input", updateGain)



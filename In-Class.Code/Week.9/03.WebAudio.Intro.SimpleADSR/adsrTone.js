const myAudio = new AudioContext();
let oscillator = null;
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gainControl = document.getElementById("gainSlider")
const adsrNode = myAudio.createGain()
const gainNode = myAudio.createGain()
adsrNode.gain.value = 0. //linear amplitude
adsrNode.connect(gainNode)
gainNode.connect(myAudio.destination)
gainNode.gain.value = 0. //linear amplitude
oscillator = myAudio.createOscillator()
oscillator.connect(adsrNode)
oscillator.type = "square"
oscillator.frequency.setValueAtTime(110, myAudio.currentTime)
oscillator.start()

const startTone = function() {
    oscillator = myAudio.createOscillator()
    oscillator.connect(adsrNode)
    oscillator.type = "square"
    oscillator.frequency.setValueAtTime(110, myAudio.currentTime)
    oscillator.start()
    adsrNode.gain.linearRampToValueAtTime(1.0, myAudio.currentTime + 2)
    // myAudio.resume()
 }

const stopTone = function() {
    console.log(adsrNode.gain.value)
    adsrNode.gain.linearRampToValueAtTime(0., myAudio.currentTime + 2)
    // oscillator.stop()
}

const updateGain = function() {
    myAudio.resume()
    let sliderVal = parseFloat(gainControl.value)
    document.getElementById("gainDisplay").innerText = `${sliderVal} dBFS`
    let linAmp = 10**(sliderVal/20)
    gainNode.gain.setValueAtTime(linAmp, myAudio.currentTime);

}

startButton.addEventListener("click", startTone);
stopButton.addEventListener("click", stopTone)
gainControl.addEventListener("input", updateGain)



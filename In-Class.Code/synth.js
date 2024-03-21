// creat WebAudio contaext
const audioContext = new (window.AudioContext || window.webkitAudioConte)();
const gainNode = audioContext.createGain();

//set default gain value
gainNode.gain.value =
  //connect gaun to destination
  gainNode.connect(audioContext.destination);

//place to store oscillator
let osc;

//get HTML ELements
const startButton = document.getElementById("start");
const stopButtin = document.getElementById("stop");
const gainCtrl = document.getElementById("volSlider");

//add Event Listeners
startButton.addEventListener("click", function () {
  audioContext.resume();
  let osc = audioContext.createOscillator();
  osc.type = "square";
  osc.frequency.value = 440;
  osc.connect(audioContext.destination);
  osc.start();
});

stopButton.addEventListener("click", function () {
  osc.stop();
});

gainCtrl.addEventListener("input", function () {
  let dB = parseFloat(gainCtrl.value);
  let linAmp = 10 ** (dB / 20);
  gainNode.gain.setValueAtTime(linAmp, audioContext.currentTime + 0.05);
  document.getElementById("volLabel").innerText = `${dB} dBFS`;
});

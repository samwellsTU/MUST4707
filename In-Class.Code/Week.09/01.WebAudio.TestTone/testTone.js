const audiocontext = new AudioContext();
let oscillator;
document.getElementById("start").addEventListener("click", () => {
  audiocontext.resume();
  oscillator = audiocontext.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(440, audiocontext.currentTime);
  oscillator.connect(audiocontext.destination);
  oscillator.start();
});

document.getElementById("stop").addEventListener("click", () => {
  oscillator.stop();
});

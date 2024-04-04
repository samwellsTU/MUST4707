
const audCtx = new (AudioContext || webkit.AudioContext)();


//create Nodes
//microphone input
let micSource = null; //empty variable to be populated later

//oscillator
const osc = audCtx.createOscillator()
const adsr = audCtx.createGain()

//file upload.
const buffer = audCtx.createBufferSource()

const inputSwitch = audCtx.createGain();
const drySig = audCtx.createGain();
const wetSig = audCtx.createGain();
const panner = audCtx.createStereoPanner()
const volume = audCtx.createGain();

//fx
//ring mod
const modulationSig = audCtx.createOscillator()
// const modulationGain = audCtx.createGain();
const ringMod = audCtx.createGain();
const distortion = audCtx.createWaveShaper()
const delay = audCtx.createDelay()
const feedback = audCtx.createGain();


//routing that will not change
inputSwitch.connect(drySig)
drySig.connect(panner)
wetSig.connect(panner)
panner.connect(volume)
volume.connect(audCtx.destination)
delay.connect(feedback)
feedback.connect(delay)


modulationSig.connect(ringMod.gain)



//initial param
delay.delayTime.setValueAtTime(250, audCtx.currentTime)
feedback.gain.setValueAtTime(0, audCtx.currentTime)







const selectMicInput = async function() {
  try {
      //to disconnect any micSource connections
      micSource.disconnect(inputSwitch)
      const micInput = await navigator.mediaDevices.getUserMedia({ audio: true });

    micSource = audCtx.createMediaStreamSource(micInput);

  } catch (err) {
    console.error('Error accessing the microphone:', err);
  }
}
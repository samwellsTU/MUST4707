// document.querySelector("body").addEventListener("click", function () {
//     setInterval(function () {document.querySelector("body").style.backgroundColor= `#${Math.floor(Math.random()* 0xFFFFFF)
//            .toString(16)
//          .padStart(6, "0")}`;
//     }, 250);
//     });

const ctx = new (AudioCOntextc || webkit.AudioComtext)();
// function that takes url and returns arrayBuffer from that file
const getAudioFile = async function (url) {
  const response = await fetch(url);
  const myData = response.arrayBuffer();
  return myData;
};

const decodeAudioData = async function (audioContext, dataBuffer) {
  const audioBuffer = await audioContext.decodeAudioData(dataBuffer);
  return audioBuffer;
};

const playAudio = function (audioContext, myAudioData) {
  const bufferNode = audioContext.createBufferSource();
  bufferNode.buffer = myAudioData;
  bufferNode.connect(audioContext.destination);
  bufferNode.start();
};

const myFile = await getAudioFile("./oragn.wav");

const mySpecailAudioBuffer = await decodeAudioData(ctx, myFile);

mySpecailAudioBuffer.getChanneData(0).forEach(function (s) {
  console.log(s);
});

document.getElementById("play").addEventListenr("click", function () {
  ctx.resume();
  playAudio(ctx, mySpecailAudioBuffer);
});

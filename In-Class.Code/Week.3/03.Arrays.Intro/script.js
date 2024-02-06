// Introduction to Arrays

let stuff = 23;

if (true) {
  const thing = "things";
}

const middleC = 60;

let waveFile = [0, 0.01, 0.02, -0.24];

let songInfo = ["myFile.wav", 2, true, stuff, middleC, [2, 3, 4]];
console.log(waveFile);
console.log(songInfo);

songInfo.push(23);

let myVar = songInfo.pop();

songInfo.push(true);
songInfo.pop();

songInfo.shift();
songInfo.unshift(12);

console.log(songInfo.length);

let chord = [60, 64, 67, 71];

chord.push(74);

chord.forEach((e) => {
  console.log(e * 0.5);
});

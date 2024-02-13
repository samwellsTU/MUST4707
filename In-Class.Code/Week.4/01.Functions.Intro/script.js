// // Introduction to Music-Themed Function Expressions
// // Function expressions let us define anonymous functions to model musical concepts and assign them to variables.

// // const hey = function (name) {
// //     console.log(`Hey, ${name}!`)
// // };

// // hey("Liam");
// // hey("Andrew");
// // hey("AJ");
// // hey("Robert");

// // console.log("Hey, Liam");
// // console.log("Hey, Andrew");
// // console.log("Hey, AJ");
// // console.log("Hey, Robert");

// const makeChord = function (root, quality) {
//   // makeChord takes a midi note number and gives us the major chord built on it
//   // let midiNote;
//   let chord = [root];
//   // let third, fifth;

//   switch (quality) {
//     case "major":
//       chord.push(root + 4);
//       chord.push(root + 7);
//       break;
//     case "minor":
//       chord.push(root + 3);
//       chord.push(root + 7);
//       break;
//     case "augmented":
//       chord.push(root + 4);
//       chord.push(root + 8);
//       break;
//     case "diminshed":
//       chord.push(root + 3);
//       chord.push(root + 6);
//       break;
//     case "maj9":
//       chord.push(root + 4);
//       chord.push(root + 7);
//       chord.push(root + 11);
//       chord.push(root + 14);
//       break;
//   }
//   return chord;

//   // if (quality == `major`) {
//   //     // chord.push(root + 4)
//   //     // chord.push(root + 7)
//   //     third = root + 4;
//   //     fifth = root + 7;
//   // } else if (quality == `minor`) {
//   //     third = root + 3;
//   //     fifth = root + 7;
//   // } else if (quality == `augmented`) {
//   //     third = root + 4;
//   //     fifth = root + 8;
//   // } else if (quality == `diminished`) {
//   //     third = root + 3;
//   //     fifth = root + 6;
//   // } else if (quality == `maj9`) {
//   //     third = root + 4;
//   //     fifth = root + 7;
//   //     seventh = root + 11;
//   //     ninth = root + 14;
//   // }

//   // chord.push(third);
//   // chord.push(fifth);

//   console.log(chord);

//   // console.log([root, root + 4, root + 7]);
// };

// makeChord(60, `major`);
// makeChord(100, `minor`);

const whatDoIDo = function (num) {
  return num % 2 == 0;
};
console.log(whatDoIDo(10));

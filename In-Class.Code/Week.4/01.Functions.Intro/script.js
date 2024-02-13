// Introduction to Music-Themed Function Expressions
// Function expressions let us define anonymous functions to model musical concepts and assign them to variables.
const myFunction = function(someData){
    console.log(`Hello, ${someData}!!!`)
}

// myFunction("Negar")
// myFunction("Sam")
// myFunction("Stella")


const makeChord = function(midiRoot, quality){
    //take a midi pitch and make all of the notes in a major chord
    let chord = [];
    chord.push(midiRoot);
    
    if (quality == 'major'){
        chord.push(midiRoot + 4)
        chord.push(midiRoot + 7)
    } else if (quality == 'minor') {
        chord.push(midiRoot + 3)
        chord.push(midiRoot + 7)
    } else if (quality == 'diminished') {
        chord.push(midiRoot + 3)
        chord.push(midiRoot + 6)
    } else if (quality == 'augmented') {
        chord.push(midiRoot + 4)
        chord.push(midiRoot + 7)
    }
    
    return chord
}

let chord = makeChord(60, 'major')
console.log(chord)
console.log(makeChord(60, 'minor'))

makeChord(48, 'diminshed')

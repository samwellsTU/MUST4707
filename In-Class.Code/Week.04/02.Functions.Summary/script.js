// Introduction to Music-Themed Function Expressions
// Function expressions let us define anonymous functions to model musical concepts and assign them to variables.

const getNoteFrequency = function(note) {
    const frequencies = {
      "A": 440,
      "B": 494,
      "C": 523,
      "D": 587,
      "E": 659,
      "F": 698,
      "G": 784
    };
    return frequencies[note] || "Note not found";
  };
  
  // Retrieve and log the frequency of a musical note
  const noteFrequency = getNoteFrequency("A");
  console.log("Frequency of note A:", noteFrequency);
  
  // Calculating the duration of a note in a tempo
  const getNoteDuration = function(tempo, noteValue) {
    // Assuming tempo is in beats per minute and quarter note gets the beat
    const quarterNoteDuration = 60 / tempo; // Duration of a quarter note in seconds
    return quarterNoteDuration * noteValue; // Returns the duration of the note
  };
  
  console.log("Duration of a whole note at 120 BPM:", getNoteDuration(120, 4));
  
  // Composing a Simple Melody
  // Let's define a function that returns a simple melody pattern
  const composeMelody = function() {
    const melody = ["C", "E", "G", "E"];
    return melody.join(" - ");
  };
  
  const melody = composeMelody();
  console.log("Simple melody composition:", melody);
  
  // Conclusion
  // Through function expressions, we've explored basic musical concepts like note frequencies, durations, and simple melody composition. This approach showcases the power and flexibility of function expressions in creating structured and thematic JavaScript code.
  
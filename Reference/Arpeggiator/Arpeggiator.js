// Defualt settings for the arpeggiator
const DEFAULT_BPM = 120;
const DEFAULT_NOTE_LENGTH = 1;
const DEFAULT_TRANSPOSE_AMOUNT = 0;
const DEFAULT_SUBDIVISION = 1 / 4; // 16th by default

/**
 * Manages MIDI input and output
 */
class MidiManager {
  constructor() {
    this.inputs;
    this.outputs;
    this.input;
    this.output;
  }
  /**
   * Initializes the MIDI interface.
   */
  async init() {
    try {
      await WebMidi.enable();
      this.onEnabled();
    } catch (err) {
      this.onError(err);
    }
  }
  /**
   * Sets up MIDI inputs and outputs upon successful initialization.
   */
  onEnabled() {
    this.inputs = WebMidi.inputs;
    this.outputs = WebMidi.outputs;
    this.input = this.inputs[0].channels[1];
    this.output = this.outputs[0].channels[2]; //solves weird stuff
    this.activeStatus = true;
  }
  /**
   * Error handling for MIDI initialization.
   */
  onError(err) {
    console.error(err);
  }
}

/**
 * Represents an arpeggiator.
 */
class Arpeggiator {
  constructor() {
    this.midi = new MidiManager();
    this.bpm = DEFAULT_BPM;
    this.subdivision = DEFAULT_SUBDIVISION;
    this.transosition = DEFAULT_TRANSPOSE_AMOUNT;
    this.noteLength = DEFAULT_NOTE_LENGTH;
    this.noteDuration = this.bpm2ms() * this.noteLength * this.subdivision;
    this.subdivisions = {
      // Various subdivision options for note duration.
      "16th Triplet": 1 / 6,
      "16th": 1 / 4,
      "8th Triplet": 1 / 3,
      "Dotted 16th": 3 / 8,
      "8th": 1 / 2,
      "quarter triplet": 2 / 3,
      "Dotted 8th": 3 / 4,
      quarter: 1,
      "half triplet": 4 / 3,
      half: 2,
      whole: 4,
    };
    this.arpIterator = 0;
    this.arpNotes = new Array();
    z
  }

  /**
   * Initializes the arpeggiator and sets up listeners.
   */
  async init() {
    try {
      await this.midi.init();
      this.updateListeners();
    } catch {
      console.log("Error");
    }
  }
  /**
   * Changes the MIDI input.
   * @param {object} i - The new MIDI Input.
   */
  changeInput(i) {
    this.midi.input = i;
    this.updateListeners();
  }
  /**
   * Changes the MIDI output.
   * @param {object} i - The new MIDI output.
   */
  changeOutput(o) {
    this.midi.output = o;
    this.updateListeners();
  }
  /**
   * Converts beats per minute (BPM) to milliseconds.
   * @return {number} The duration in milliseconds.
   */
  bpm2ms() {
    return (60 / this.bpm) * 1000;
  }
  /**
   * Sets a new BPM and updates the note duration.
   * @param {number} newBPM - The new BPM value.
   */
  setBPM(newBPM) {
    this.bpm = newBPM;
    this.noteDuration = this.bpm2ms() * this.subdivision;
    if (this.arpNotes.length != 0) {
      clearInterval(this.arpContainer);
      this.arpContainer = setInterval(this.playNote, this.noteDuration);
    }
  }
  /**
   * Plays the next note in the arpeggiator sequence.
   */
  playNote() {
    // Calculate pitch and other parameters for the current arpeggio note.

    console.log(this.arpNotes);
    let pitch = this.arpNotes[this.arpIterator % this.arpNotes.length];
    pitch += this.transosition;
    let vel = 65; // Velocity of the note.
    let note_params = {
      duration: this.noteDuration * this.noteLength, // Duration of the note.
      rawAttack: vel, // Attack velocity of the note.
    };
    // console.log(note_params.duration);
    let my_note = new Note(pitch, note_params); // Create a MIDI note.
    this.midi.output.playNote(my_note); // Play the MIDI note.
    this.arpIterator++; // Increment the iterator for the next note
  }
  /**
   * Updates MIDI event listeners for note on and off events.
   */
  updateListeners() {
    console.log(this.arpNotes.length);
    this.midi.input.removeListener("noteon");
    this.midi.input.addListener("noteon", (midimessage) => {
      //   this.addNotes(midimessage);

      if (this.arpNotes.length == 0) {
        clearInterval(this.arpContainer);
        this.arpNotes.push(midimessage.note.number);
        this.arpContainer = setInterval(this.playNote, this.noteDuration);
      } else {
        this.arpNotes.push(midimessage.note.number);
      }
      console.log(`Adding ${midimessage.note.number}`);
    });
    this.midi.input.removeListener("noteoff");
    this.midi.input.addListener("noteoff", (midimessage) => {
      // Remove the note from the arpeggio notes array.
      let dump = this.arpNotes.splice(
        this.arpNotes.indexOf(midimessage.note.number),
        1
      );
      console.log(`Removing ${dump}`);
      if (this.arpNotes.length == 0) {
        clearInterval(this.arpContainer);
        console.log("Arpeggio Stopped!");
      }
    });
  }
}

export { Arpeggiator, MidiManager };

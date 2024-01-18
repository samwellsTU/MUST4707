export class Arpeggiator {
  constructor(bpm, noteLength, subdivison, arpNotes) {
    this.bpm = bpm;
    this.noteLength = noteLength;
    this.subdivision = subdivison;
    this.arpNotes = arpNotes;
  }
  info() {
    console.log(
      `This arpeggiator is going to play the notes: ${
        this.arpNotes
      } at a tempo of ${this.bpm}. It will play ${
        this.subdivison
      } notes per beat. Each note will be ${
        this.noteLength * 100
      } % of a beat long.`
    );
  }
}

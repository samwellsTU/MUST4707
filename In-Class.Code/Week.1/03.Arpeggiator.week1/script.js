const myArpeggiator = {
  bpm: 120,
  noteLength: 0.99,
  subdivison: 1,
  arpNotes: [60, 64, 67, 71],
  info: function () {
    console.log(
      `This arpeggiator is going to play the notes: ${
        this.arpNotes
      } at a tempo of ${this.bpm}. It will play ${
        this.subdivison
      } notes per beat. Each note will be ${
        this.noteLength * 100
      } % of a beat long.`
    );
  },
};

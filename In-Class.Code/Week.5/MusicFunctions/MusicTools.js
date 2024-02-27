const MusicTools = {
  middle: "C4",
  standardPtich: 440,
  /**
   * Converts a MIDI pitch number to a frequency in Hz.
   * @param {number} midiPitch - The MIDI pitch number.
   * @returns {number} The frequency in Hz.
   * @example
   * midiPtichToFrequency (60)
   * // returns 261.65
   */
  midiPitchToFrequency: function (midiPitch) {
    return this.standardPtich * Math.pow(2, (midiPitch - 69) / 12);
  },

  /**
   * Converts a frequency in Hz to the corresponding MIDI pitch number.
   * @param {number} frequency - The frequency in Hz.
   * @returns {number} The MIDI pitch number.
   */
  frequencyToMidiPitch: function (frequency) {
    return 69 + 12 * Math.log2(frequency / this.standardPtich);
  },

  /**
   * Convert linear amplitude to Decibels Full Scale
   * @param {number} lineAmp
   * @returns {number} dBFS
   */
  atodb: function (lineAmp) {
    return 20 * Math.log10(linAmp);
  },

  /**
   * Concerts Decibels Full Scale to Linear Amplitude
   * @param {number} dBFS
   * @param {boolean}
   * @returns {number} Linear Amplitude
   */
  dbtoan: function (dBFS, int16) {
    let linAmp = Math.pow(10, dBFS / 20);
    if (int16) {
      linAmp = Math.floor(linAmp * 32768);
    }
    return linAmp;
  },
};

export default MusicTools;


/**
 * Converts a MIDI pitch number to a frequency in Hz.
 * @param {number} midiPitch - The MIDI pitch number.
 * @returns {number} The frequency in Hz.
 */
const midiPitchToFrequency = function(midiPitch) {
  return 440 * Math.pow(2, (midiPitch - 69) / 12);
};

/**
 * Converts a frequency in Hz to the corresponding MIDI pitch number.
 * @param {number} frequency - The frequency in Hz.
 * @returns {number} The MIDI pitch number.
 */
const frequencyToMidiPitch = function(frequency) {
  return 69 + 12 * Math.log2(frequency / 440);
}
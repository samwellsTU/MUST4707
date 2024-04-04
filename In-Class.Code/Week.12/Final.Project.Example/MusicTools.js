/**
 * Object containing four methods for musical math conversions.
 */
export const musicTools = {
    standardPitch: 440,
    middleC: 'C4',

    /**
     * Converts a MIDI pitch number to a frequency in Hz.
     * @param {number} midiPitch - The MIDI pitch number.
     * @returns {number} The frequency in Hz.
     */
    midiPitchToFrequency(midiPitch) {
        return this.standardPitch * Math.pow(2, (midiPitch - 69) / 12);
    },

    /**
     * Converts a frequency in Hz to the corresponding MIDI pitch number.
     * @param {number} frequency - The frequency in Hz.
     * @returns {number} The MIDI pitch number.
     */
    frequencyToMidiPitch(frequency) {
        return 69 + 12 * Math.log2(frequency / this.standardPitch);
    },

    /**
     * Converts an amplitude level in dBFS to a linear amplitude value.
     * @param {number} dbfs - The amplitude level in dBFS.
     * @returns {number} The linear amplitude.
     */
    dbfsToLinearAmplitude(dbfs) {
        return Math.pow(10, dbfs / 20);
    },

    /**
     * Converts a linear amplitude value to an amplitude level in dBFS.
     * @param {number} linear - The linear amplitude value.
     * @returns {number} The dBFS level.
     */
    linearAmplitudeTodBFS(linear) {
        return 20 * Math.log10(linear);
    }
};

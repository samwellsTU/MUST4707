graph TD
A[Web Page: Arpeggiator] -->|Uses| B(WebMidi Library)
A -->|Controls| C[Arpeggiator.js]
A -->|Controls| D[script.js]

    B -->|Manages MIDI I/O| E[MIDI Input Selection]
    B -->|Manages MIDI I/O| F[MIDI Output Selection]

    C -->|Handles Arpeggiation Logic| G[Parameters Adjustment]

    D -->|Initializes Components| E
    D -->|Initializes Components| F
    D -->|Initializes Components| G

    G -->|Includes| H[BPM Setting]
    G -->|Includes| I[Subdivision Setting]
    G -->|Includes| J[Transposition Setting]
    G -->|Includes| K[Note Length Setting]

    E -->|MIDI Input Data| C
    F -->|MIDI Output Commands| C

    C -.->|Sends MIDI Notes| F

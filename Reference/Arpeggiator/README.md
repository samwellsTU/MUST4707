```mermaid
graph TD
    A[HTML Page: Arpeggiator Interface] --> B[WebMidi Library]
    A -->|Loads| C[Arpeggiator.js]
    A -->|Loads| D[script.js]
    
    B -->|Handles| E[MIDI Input Dropdown]
    B -->|Handles| F[MIDI Output Dropdown]
    
    C -->|Generates Arpeggios| G[Adjustable Parameters]
    
    D -->|Initial Setup| E
    D -->|Initial Setup| F
    D -->|Initial Setup| G
    
    G -->|User Can Adjust| H[Tempo (BPM)]
    G -->|User Can Adjust| I[Subdivision]
    G -->|User Can Adjust| J[Transposition]
    G -->|User Can Adjust| K[Note Length]
    
    E -.->|User Chooses| C
    F -.->|For Output| C

```

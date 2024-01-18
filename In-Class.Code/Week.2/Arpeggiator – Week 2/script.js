import { Arpeggiator } from "./Arpeggiator.js";

const arp1 = new Arpeggiator(104, 0.5, 2, [60, 61, 63, 73]);
const arp2 = new Arpeggiator(144, 1.9, 4, [42, 34, 45, 72]);

arp1.info();
arp2.info();

console.log(`Arp 1's bpm is ${arp1.bpm}`);
console.log(`Arp 2's bpm is ${arp2.bpm}`);

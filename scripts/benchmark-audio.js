const { performance } = require('perf_hooks');

const frequencies = new Uint8Array(256).fill(100);
const iterations = 1000000;

// Current implementation
const start = performance.now();
for (let i = 0; i < iterations; i++) {
    const bassEnd = Math.floor(frequencies.length * 0.1);
    const midEnd = Math.floor(frequencies.length * 0.3);
    const bass = frequencies.slice(0, bassEnd).reduce((sum, value) => sum + value, 0) / bassEnd;
    const mid = frequencies.slice(bassEnd, midEnd).reduce((sum, value) => sum + value, 0) / (midEnd - bassEnd);
    const treble = frequencies.slice(midEnd).reduce((sum, value) => sum + value, 0) / (frequencies.length - midEnd);
}
const end = performance.now();
console.log(`Current: ${(end - start).toFixed(2)}ms`);

// Optimized implementation
const startOpt = performance.now();
for (let i = 0; i < iterations; i++) {
    let bassSum = 0, midSum = 0, trebleSum = 0;
    const bassEnd = Math.floor(frequencies.length * 0.1);
    const midEnd = Math.floor(frequencies.length * 0.3);
    for (let j = 0; j < bassEnd; j++) bassSum += frequencies[j];
    for (let j = bassEnd; j < midEnd; j++) midSum += frequencies[j];
    for (let j = midEnd; j < frequencies.length; j++) trebleSum += frequencies[j];
    const bass = bassSum / bassEnd;
    const mid = midSum / (midEnd - bassEnd);
    const treble = trebleSum / (frequencies.length - midEnd);
}
const endOpt = performance.now();
console.log(`Optimized: ${(endOpt - startOpt).toFixed(2)}ms`);

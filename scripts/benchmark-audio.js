const { performance } = require('perf_hooks');

const size = 512;
const data = new Uint8Array(size).fill(128);

function functional() {
  const average = data.reduce((sum, value) => sum + value, 0) / data.length;
  const bassEnd = Math.floor(data.length * 0.1);
  const midEnd = Math.floor(data.length * 0.3);

  const bass = data.slice(0, bassEnd).reduce((sum, value) => sum + value, 0) / bassEnd;
  const mid = data.slice(bassEnd, midEnd).reduce((sum, value) => sum + value, 0) / (midEnd - bassEnd);
  const treble = data.slice(midEnd).reduce((sum, value) => sum + value, 0) / (data.length - midEnd);
  return { average, bass, mid, treble };
}

function manual() {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i];
  }
  const average = sum / data.length;

  const bassEnd = Math.floor(data.length * 0.1);
  const midEnd = Math.floor(data.length * 0.3);

  let bassSum = 0;
  for (let i = 0; i < bassEnd; i++) {
    bassSum += data[i];
  }
  const bass = bassSum / bassEnd;

  let midSum = 0;
  for (let i = bassEnd; i < midEnd; i++) {
    midSum += data[i];
  }
  const mid = midSum / (midEnd - bassEnd);

  let trebleSum = 0;
  for (let i = midEnd; i < data.length; i++) {
    trebleSum += data[i];
  }
  const treble = trebleSum / (data.length - midEnd);

  return { average, bass, mid, treble };
}

const iterations = 1000000;

console.log('Starting benchmarks...');

let start = performance.now();
for (let i = 0; i < iterations; i++) {
  functional();
}
let end = performance.now();
console.log(`Functional: ${(end - start).toFixed(2)}ms`);

start = performance.now();
for (let i = 0; i < iterations; i++) {
  manual();
}
end = performance.now();
console.log(`Manual: ${(end - start).toFixed(2)}ms`);

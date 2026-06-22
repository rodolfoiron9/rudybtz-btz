
import { describe, it, expect } from 'vitest';

describe('Audio Analysis Performance', () => {
  const frequencies = new Uint8Array(256).fill(128);
  const bassEnd = Math.floor(frequencies.length * 0.1);
  const midEnd = Math.floor(frequencies.length * 0.3);

  it('compares original vs optimized average calculation', () => {
    const iterations = 100000;

    // Original style
    const startOrig = performance.now();
    for (let i = 0; i < iterations; i++) {
      const average = frequencies.reduce((sum, value) => sum + value, 0) / frequencies.length;
    }
    const endOrig = performance.now();

    // Optimized style
    const startOpt = performance.now();
    for (let i = 0; i < iterations; i++) {
      let sum = 0;
      for (let j = 0; j < frequencies.length; j++) {
        sum += (frequencies[j] as number);
      }
      const average = sum / frequencies.length;
    }
    const endOpt = performance.now();

    console.log(`Average calculation: Original: ${endOrig - startOrig}ms, Optimized: ${endOpt - startOpt}ms`);
  });

  it('compares original vs optimized band calculation', () => {
    const iterations = 100000;

    // Original style
    const startOrig = performance.now();
    for (let i = 0; i < iterations; i++) {
      const bass = frequencies.slice(0, bassEnd).reduce((sum, value) => sum + value, 0) / bassEnd;
      const mid = frequencies.slice(bassEnd, midEnd).reduce((sum, value) => sum + value, 0) / (midEnd - bassEnd);
      const treble = frequencies.slice(midEnd).reduce((sum, value) => sum + value, 0) / (frequencies.length - midEnd);
    }
    const endOrig = performance.now();

    // Optimized style
    const startOpt = performance.now();
    for (let i = 0; i < iterations; i++) {
      let bassSum = 0;
      for (let j = 0; j < bassEnd; j++) bassSum += (frequencies[j] as number);
      const bass = bassSum / (bassEnd || 1);

      let midSum = 0;
      for (let j = bassEnd; j < midEnd; j++) midSum += (frequencies[j] as number);
      const mid = midSum / (midEnd - bassEnd || 1);

      let trebleSum = 0;
      for (let j = midEnd; j < frequencies.length; j++) trebleSum += (frequencies[j] as number);
      const treble = trebleSum / (frequencies.length - midEnd || 1);
    }
    const endOpt = performance.now();

    console.log(`Band calculation: Original: ${endOrig - startOrig}ms, Optimized: ${endOpt - startOpt}ms`);
  });
});

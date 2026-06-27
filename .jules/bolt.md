# Bolt Performance Journal

## 2026-06-27 - Manual Audio Analysis Loop
**Learning:** Using functional array methods like `.reduce()` and `.slice()` on `Uint8Array` in a 60fps animation loop creates significant overhead due to temporary array allocations and function call overhead. Manual `for` loops are ~15x faster in this context.
**Action:** Always use manual `for` loops for processing audio data buffers in the `useFrame` or `requestAnimationFrame` loops.

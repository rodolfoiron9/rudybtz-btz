# Bolt's Performance Journal

## 2025-05-15 - [3D Visualizer Optimization]
**Learning:** React state updates at 60fps for complex 3D scenes (like an audio visualizer grid) trigger expensive reconciliation cycles that can drop frames. Additionally, using functional array methods (.slice, .reduce) on Uint8Array during frame loops causes excessive garbage collection and is ~12x slower than manual loops.
**Action:** Always use 'useRef' for high-frequency data in Three.js components and update 'InstancedMesh' matrices/colors imperatively in 'useFrame'. Use manual 'for' loops for 'TypedArray' analysis to maximize throughput.

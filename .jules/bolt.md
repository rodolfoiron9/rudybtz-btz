## 2025-05-14 - [React State vs Refs for High-Frequency Updates]
**Learning:** Using React state for data that updates every frame (60fps) causes unnecessary re-renders and slows down the main thread.
**Action:** Use `useRef` to store high-frequency data and consume it within the `useFrame` loop in React-Three-Fiber to bypass React's reconciliation cycle.

## 2025-05-14 - [InstancedMesh for Reduced Draw Calls]
**Learning:** Rendering many individual meshes in Three.js leads to high draw calls, which is a major GPU bottleneck.
**Action:** Switch to `InstancedMesh` to render many instances of the same geometry with a single draw call, and use `setMatrixAt` for efficient updates.

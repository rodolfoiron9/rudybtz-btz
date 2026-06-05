## 2025-05-15 - [Optimize 3D Visualizer with instancedMesh and Ref-based updates]
**Learning:** React state updates at 60fps (for audio visualization) trigger expensive reconciliation cycles. Moving high-frequency data to `useRef` and using `useFrame` to update Three.js objects directly bypassing React is significantly more efficient. Additionally, replacing individual `Mesh` objects with `instancedMesh` reduces draw calls from O(n) to O(1).
**Action:** Always prefer `useRef` + `useFrame` for high-frequency animations in R3F, and use `instancedMesh` when rendering many identical geometries.

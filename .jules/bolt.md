## 2025-05-15 - [Initial Entry]
**Learning:** High-frequency updates in React Three Fiber (like audio visualizers) should avoid React state for the data stream to prevent O(N) re-renders. Use `InstancedMesh` instead of individual Mesh components to reduce draw calls from O(N) to O(1).
**Action:** Use `useRef` for high-frequency data and `InstancedMesh` for repetitive geometries.

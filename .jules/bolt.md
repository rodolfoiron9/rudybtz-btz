## 2026-06-29 - [Anti-pattern] React State for 60fps R3F Updates
**Learning:** Using `useState` to propagate high-frequency data (like audio frequencies) to Three.js components triggers full React reconciliation on every frame, causing significant CPU overhead and potential frame drops.
**Action:** Always use `useRef` for data that updates every frame and perform imperative updates within the `useFrame` loop. Use `InstancedMesh` to consolidate multiple similar objects into a single draw call.

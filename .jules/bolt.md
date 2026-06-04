## 2025-05-14 - Optimized 3D Visualizer with InstancedMesh and Ref-based Updates

**Learning:** In React Three Fiber, updating state at 60fps triggers full React reconciliation cycles which is extremely CPU-intensive. Additionally, rendering hundreds of individual meshes causes high draw call counts, bottlenecking the GPU.

**Action:** Use `instancedMesh` to reduce draw calls to 1 for repetitive geometries. Use `useRef` for high-frequency data (like audio analysis) and update Three.js objects directly inside `useFrame` to bypass React's render cycle.

## 2025-05-22 - Hot Path Optimization in React Three Fiber

**Learning:** In React Three Fiber (R3F) applications, triggering React state updates in high-frequency loops (like audio analysis at 60fps) causes the entire component tree to re-reconcile, leading to significant CPU overhead and frame drops. Furthermore, rendering large numbers of individual `THREE.Mesh` objects creates a linear increase in draw calls (O(N)), which quickly bottlenecks the GPU.

**Action:**
1. Use `useRef` to store frequently changing data (like audio frequency metrics) and access them directly within `useFrame` to bypass React's reconciliation cycle.
2. Replace grids or groups of similar meshes with `THREE.InstancedMesh` to reduce draw calls from O(N) to O(1).
3. Pre-allocate utility objects (like `THREE.Object3D` or `THREE.Color`) and buffers (like `Uint8Array`) outside the frame loop to prevent Garbage Collection (GC) pressure.
4. Use manual `for` loops instead of functional array methods (`reduce`, `slice`) in performance-critical sections to avoid temporary object allocations.

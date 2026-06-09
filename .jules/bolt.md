# Bolt Performance Journal

## 2025-05-22 - Optimizing 3D Visualizer with InstancedMesh and Ref-based Updates
**Learning:** High-frequency updates (60fps) in React Three Fiber should bypass React state to avoid massive reconciliation overhead. Using `THREE.InstancedMesh` is critical for grid-based visualizations to keep draw calls low.
**Action:** Always use `useRef` for data that updates every frame and `instancedMesh` for repeated geometries. Ensure proper `.dispose()` of Three.js objects in `useEffect` cleanups.

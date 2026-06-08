
## 2025-05-22 - [Optimized 3D Visualizer Performance]
**Learning:** High-frequency (60fps) updates in React Three Fiber should bypass React's state/reconciliation loop by using `useRef` for data and direct attribute updates in `useFrame`. `InstancedMesh` is critical for reducing draw calls from (N^2)$ to (1)$ when rendering grids.
**Action:** Always prefer `useRef` for animation data and `InstancedMesh` for repetitive geometry in future 3D visualizations. Ensure manual resource disposal (`.dispose()`) for geometries/materials.

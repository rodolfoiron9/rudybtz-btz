# Bolt Performance Journal

## 2026-06-16 - [High-Frequency 3D Visualization Optimization]
**Learning:** Updating React state at 60fps for 3D visualizations causes massive overhead due to React's reconciliation cycle. Using `instancedMesh` and `useRef` for data allows bypassing React and updating the GPU directly within the `useFrame` loop.
**Action:** Use `useRef` for high-frequency data and `instancedMesh` for multiple similar 3D objects. Pre-allocate utility objects (Vector3, Matrix4, Color) outside the frame loop.

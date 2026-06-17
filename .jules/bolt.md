## 2026-06-17 - [R3F InstancedMesh Race Condition]
**Learning:** When using `InstancedMesh` with a dynamic count (e.g., from a prop like `gridSize`), there is a race condition between the `useEffect` that recreates the mesh and the `useFrame` loop. `useFrame` may attempt to access indices based on the new prop before the `useEffect` has finished replacing the mesh, leading to out-of-bounds errors.
**Action:** Always include a safety check in `useFrame` to verify `mesh.count === expectedCount` before processing instances.

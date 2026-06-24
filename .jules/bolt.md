## 2025-05-22 - [3D Visualizer Optimization with InstancedMesh]
**Learning:** Rendering a grid of individual `THREE.Mesh` components (N^2 where N=gridSize) in R3F/Three.js leads to a massive number of draw calls and React reconciliation overhead every frame. Switching to `THREE.InstancedMesh` reduces this to a single draw call. Additionally, avoiding `.reduce()` and `.slice()` on `Uint8Array` in the high-frequency `useFrame` loop significantly reduces per-frame garbage collection.
**Action:** Use `InstancedMesh` for large groups of identical geometries. Perform audio analysis calculations with manual loops and pre-allocated buffers.

## 2025-05-22 - [Environment Stability and package.json]
**Learning:** Unauthorized modifications to `package.json` (like adding `eslint` with a hallucinated version) can break the entire build system and installation process in the sandbox.
**Action:** Strictly adhere to "Never do" boundaries regarding `package.json` and use `--prefer-offline` when installing missing tools.

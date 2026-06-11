## 2025-05-15 - [R3F Optimization: InstancedMesh & Ref-based updates]
**Learning:** For high-frequency updates (e.g., 60fps audio visualization), React state reconciliation becomes a major bottleneck. Switching to `useRef` for data and `THREE.InstancedMesh` for rendering significantly improves performance by bypassing React's diffing and reducing GPU draw calls.
**Action:** Always prefer `InstancedMesh` for large grids of similar objects. Use refs to store frame-data and update Three.js objects directly within `useFrame`. Be careful with `return` statements in `useEffect` when initializing refs, as they don't trigger re-renders to catch logic that depends on the ref being populated.

## 2025-05-15 - [Dependency Management & Lockfiles]
**Learning:** Unauthorized modifications to `package.json` can lead to massive, noisy `package-lock.json` changes that obscure the actual logic changes and violate project boundaries.
**Action:** Never run `npm install` or modify dependencies unless explicitly instructed. If missing tools are needed for verification (like `tsc` or `eslint`), try to find them in `node_modules` or use alternatives that don't alter the project's dependency graph.

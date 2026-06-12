## 2025-05-15 - [R3F Optimization: InstancedMesh & Ref-based Data]
**Learning:** For high-frequency updates (60fps) like audio visualizers in React Three Fiber, React state causes massive overhead due to reconciliation. Moving data to `useRef` and using `THREE.InstancedMesh` with direct attribute updates in `useFrame` dramatically improves performance.
**Action:** Always prefer `useRef` + `useFrame` for data that changes every frame. Use `InstancedMesh` to keep draw calls at O(1) instead of O(N).

## 2025-05-15 - [Boundary Violation: Modifying package.json]
**Learning:** Adding dependencies (like `eslint`) even to help with local verification can lead to massive lockfile changes and violates project boundaries.
**Action:** Do not modify `package.json` unless explicitly instructed. Rely on pre-installed tools or manual verification if tools are missing.

## 2025-05-15 - [InstancedMesh and Ref-based Audio Visualization]
**Learning:** High-frequency updates (60fps) in React Three Fiber should bypass React's state/reconciliation cycle entirely. Using `useState` for audio data triggers 60 re-renders per second, which is extremely expensive for the CPU and main thread. Migrating to `useRef` and updating the `InstancedMesh` matrices imperatively in the `useFrame` loop drastically reduces both CPU and GPU overhead.
**Action:** Always prefer `useRef` for high-frequency data and `InstancedMesh` for repeated 3D objects in this codebase.

## 2025-05-15 - [Testing R3F Components in JSDOM]
**Learning:** Testing React Three Fiber components with `@testing-library/react` in a JSDOM environment often fails because Three.js objects (like `THREE.Group`) might not have their full prototype chain initialized or mocked correctly. A common failure is `groupRef.current.add is not a function`.
**Action:** Use optional chaining or explicit checks like `if (!groupRef.current?.add) return;` in `useEffect` hooks that interact with Three.js refs to ensure tests don't crash when running in non-WebGL environments.

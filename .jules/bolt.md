## 2025-05-15 - R3F Performance Bottleneck: React Reconciliation & Draw Calls
**Learning:** High-frequency audio visualizations (60fps) in React Three Fiber suffer significant performance degradation when audio data is managed via React state. Each frame triggers a full reconciliation of the component tree, even if only a few properties change. Additionally, rendering many individual meshes for a grid leads to O(N) draw calls, which becomes a bottleneck for the GPU.
**Action:** Use `InstancedMesh` to reduce draw calls from O(N) to O(1). Move high-frequency data (like FFT results) to `useRef` and perform imperative updates within a `useFrame` loop. This bypasses React's reconciliation cycle entirely for the visual updates.

## 2025-05-15 - Firebase SSR & Dev Server Initialization
**Learning:** Initializing Firebase with invalid or missing API keys can cause the Next.js dev server to crash during SSR with an `auth/invalid-api-key` error. This prevents visual verification of components even if they don't directly use Firebase.
**Action:** Implement a mock `AuthProvider` and use safe initialization (try-catch) in `lib/firebase.ts` to allow the application to boot in environments where real secrets are unavailable.

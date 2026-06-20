## 2025-05-14 - [R3F state-to-ref migration regression]
**Learning:** When optimizing R3F components by moving high-frequency data from React state to refs (to skip reconciliation), any children relying on that state (e.g., Light intensities, UI overlays) will stop updating. These must be converted to imperative updates within the `useFrame` loop.
**Action:** Always audit child components for state dependencies when bypassing React's render cycle, and implement imperative updates for any reactive properties.

## 2026-06-21 - [State to Ref Optimization Loophole]
**Learning:** When optimizing R3F components by switching from state to refs for high-frequency data, ensure all downstream visual elements (like light intensities or dependent UI) are also converted to ref-based updates within the `useFrame` loop. Otherwise, they will stop being reactive as the component no longer re-renders.
**Action:** Always audit all visual effects that depend on the high-frequency state before switching to refs, and convert them to imperative updates.

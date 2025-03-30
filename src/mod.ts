/**
 * use-haptic
 *
 * A React hook library that provides haptic feedback functionality for mobile web applications.
 * This library uses the `input[switch]` element for iOS devices and the Vibration API for other devices.
 *
 * @example
 * ```tsx
 * import { useHaptic } from "use-haptic";
 *
 * function VibrationButton() {
 *   const { vibe } = useHaptic();
 *   return <button onClick={vibe}>Vibe</button>;
 * }
 * ```
 */

export * from "./useHaptic.ts";

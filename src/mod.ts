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
 * function HapticButton() {
 *   const { triggerHaptic } = useHaptic();
 *   return <button onClick={triggerHaptic}>Haptic</button>;
 * }
 * ```
 */

export * from "./useHaptic.ts";

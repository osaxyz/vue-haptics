import type { MaybeRefOrGetter } from "vue"

/**
 * Vibration length in milliseconds, or an alternating on/off pattern
 * in the same shape as `navigator.vibrate()`.
 */
export type HapticPattern = number | readonly number[]

export type HapticsOptions = {
    /** Pattern used when none is passed to the trigger. */
    pattern?: MaybeRefOrGetter<HapticPattern | undefined>
    /** Suppress haptics while this is true. */
    disabled?: MaybeRefOrGetter<boolean | undefined>
}

export type HapticsPluginOptions = HapticsOptions & {
    /**
     * Name of the globally registered directive, without the `v-` prefix.
     * Pass `false` to skip registration.
     * @default "haptic"
     */
    directive?: string | false
}

/**
 * `v-haptic` accepts a pattern, or a boolean to switch it on and off.
 */
export type HapticDirectiveValue = HapticPattern | boolean | null | undefined

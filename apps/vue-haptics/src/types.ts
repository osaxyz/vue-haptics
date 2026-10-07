import type { MaybeRefOrGetter } from "vue"

export type HapticsOptions = {
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
 * `v-haptic` takes a boolean to switch it on and off. Without a value it is on.
 */
export type HapticDirectiveValue = boolean | null | undefined

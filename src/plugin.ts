import type { InjectionKey, Plugin } from "vue"
import { createHapticDirective, type HapticDirective } from "./directive"
import type { HapticsOptions, HapticsPluginOptions } from "./types"

export const HAPTICS_KEY: InjectionKey<HapticsOptions> = Symbol("vue-haptics")

/**
 * Plugin that registers `v-haptic` globally and sets app-wide defaults
 * for both the directive and `useHaptics()`.
 *
 * @example
 * ```ts
 * import { createApp } from "vue"
 * import { createHaptics } from "vue-haptics"
 *
 * createApp(App)
 *     .use(createHaptics({ pattern: 15, disabled: () => settings.reduce_haptics }))
 *     .mount("#app")
 * ```
 */
export const createHaptics = (options: HapticsPluginOptions = {}): Plugin => ({
    install(app) {
        const { directive = "haptic", ...defaults } = options

        app.provide(HAPTICS_KEY, defaults)
        if (directive !== false) {
            app.directive(directive, createHapticDirective(defaults))
        }
    },
})

declare module "vue" {
    interface GlobalDirectives {
        vHaptic: HapticDirective
    }
}

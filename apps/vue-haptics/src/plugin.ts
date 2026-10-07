import type { Plugin } from "vue"
import { createHapticDirective, type HapticDirective } from "./directive"
import type { HapticsPluginOptions } from "./types"

/**
 * Plugin that registers `v-haptic` globally.
 *
 * @example
 * ```ts
 * import { createApp } from "vue"
 * import { createHaptics } from "vue-haptics"
 *
 * createApp(App)
 *     .use(createHaptics({ disabled: () => !settings.haptics }))
 *     .mount("#app")
 * ```
 */
export const createHaptics = (options: HapticsPluginOptions = {}): Plugin => ({
    install(app) {
        const { directive = "haptic", ...defaults } = options
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

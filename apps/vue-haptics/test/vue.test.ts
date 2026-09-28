import { mount } from "@vue/test-utils"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { defineComponent, h, nextTick, ref, withDirectives } from "vue"
import {
    createHaptics,
    type HapticDirectiveValue,
    type HapticsOptions,
    useHaptics,
    vHaptic,
} from "../src"
import { stubVibrate } from "./helpers"

let vibrate: ReturnType<typeof stubVibrate>

beforeEach(() => {
    vibrate = stubVibrate(() => true)
})

afterEach(() => {
    stubVibrate(null)
})

describe("useHaptics", () => {
    const mountWith = (options?: HapticsOptions, plugin_options = {}) => {
        let result!: ReturnType<typeof useHaptics>
        const wrapper = mount(
            defineComponent({
                setup() {
                    result = useHaptics(options)
                    return () => h("button", { onClick: result.trigger }, "Tap")
                },
            }),
            { global: { plugins: [createHaptics(plugin_options)] } },
        )
        return { wrapper, result }
    }

    it("ignores the event when bound as a handler", async () => {
        const { wrapper } = mountWith({ pattern: 25 })

        await wrapper.find("button").trigger("click")

        expect(vibrate).toHaveBeenCalledWith(25)
    })

    it("prefers an explicit pattern", () => {
        const { result } = mountWith({ pattern: 25 })

        result.trigger([5, 5, 5])

        expect(vibrate).toHaveBeenCalledWith([5, 5, 5])
    })

    it("falls back to the plugin defaults", () => {
        const { result } = mountWith(undefined, { pattern: 40 })

        result.trigger()

        expect(vibrate).toHaveBeenCalledWith(40)
    })

    it("follows a reactive disabled option", () => {
        const disabled = ref(true)
        const { result } = mountWith({ disabled })

        result.trigger()
        expect(vibrate).not.toHaveBeenCalled()

        disabled.value = false
        result.trigger()
        expect(vibrate).toHaveBeenCalledTimes(1)
    })

    it("lets a local disabled override the plugin", () => {
        const { result } = mountWith({ disabled: false }, { disabled: true })

        result.trigger()

        expect(vibrate).toHaveBeenCalledTimes(1)
    })

    it("reports support only after mount", async () => {
        const { result } = mountWith()

        await nextTick()

        expect(result.isSupported.value).toBe(true)
    })

    it("works outside a component", () => {
        const { trigger, isSupported } = useHaptics({ pattern: 7 })

        trigger()

        expect(vibrate).toHaveBeenCalledWith(7)
        expect(isSupported.value).toBe(true)
    })
})

describe("v-haptic", () => {
    const mountButton = (
        value: () => HapticDirectiveValue,
        arg?: () => string | undefined,
    ) =>
        mount(
            defineComponent({
                setup: () => () =>
                    withDirectives(h("button", "Tap"), [
                        [vHaptic, value(), arg?.()],
                    ]),
            }),
        )

    it("plays the default pattern on click", async () => {
        const wrapper = mountButton(() => undefined)

        await wrapper.find("button").trigger("click")

        expect(vibrate).toHaveBeenCalledWith(10)
    })

    it("uses the bound pattern and follows updates", async () => {
        const pattern = ref<HapticDirectiveValue>(30)
        const wrapper = mountButton(() => pattern.value)

        await wrapper.find("button").trigger("click")
        pattern.value = [1, 2, 3]
        await nextTick()
        await wrapper.find("button").trigger("click")

        expect(vibrate).toHaveBeenNthCalledWith(1, 30)
        expect(vibrate).toHaveBeenNthCalledWith(2, [1, 2, 3])
    })

    it("does nothing when bound to false", async () => {
        const wrapper = mountButton(() => false)

        await wrapper.find("button").trigger("click")

        expect(vibrate).not.toHaveBeenCalled()
    })

    it("listens to the event given as the argument", async () => {
        const event = ref<string | undefined>("pointerdown")
        const wrapper = mountButton(
            () => undefined,
            () => event.value,
        )
        const button = wrapper.find("button")

        await button.trigger("click")
        expect(vibrate).not.toHaveBeenCalled()
        await button.trigger("pointerdown")
        expect(vibrate).toHaveBeenCalledTimes(1)

        event.value = undefined
        await nextTick()
        await button.trigger("pointerdown")
        await button.trigger("click")
        expect(vibrate).toHaveBeenCalledTimes(2)
    })

    it("removes its listener on unmount", async () => {
        const wrapper = mountButton(() => undefined)
        const button = wrapper.find("button").element
        const remove = vi.spyOn(button, "removeEventListener")

        wrapper.unmount()

        expect(remove).toHaveBeenCalledWith("click", expect.any(Function))
    })
})

describe("createHaptics", () => {
    const mountTemplate = (template: string, plugin_options = {}) =>
        mount(
            { template },
            { global: { plugins: [createHaptics(plugin_options)] } },
        )

    it("registers v-haptic with the plugin defaults", async () => {
        const wrapper = mountTemplate("<button v-haptic>Tap</button>", {
            pattern: 50,
        })

        await wrapper.find("button").trigger("click")

        expect(vibrate).toHaveBeenCalledWith(50)
    })

    it("disables the directive through the plugin", async () => {
        const disabled = ref(true)
        const wrapper = mountTemplate("<button v-haptic>Tap</button>", {
            disabled: () => disabled.value,
        })

        await wrapper.find("button").trigger("click")
        expect(vibrate).not.toHaveBeenCalled()

        disabled.value = false
        await wrapper.find("button").trigger("click")
        expect(vibrate).toHaveBeenCalledTimes(1)
    })

    it("registers the directive under a custom name", async () => {
        const wrapper = mountTemplate("<button v-buzz>Tap</button>", {
            directive: "buzz",
        })

        await wrapper.find("button").trigger("click")

        expect(vibrate).toHaveBeenCalledTimes(1)
    })
})

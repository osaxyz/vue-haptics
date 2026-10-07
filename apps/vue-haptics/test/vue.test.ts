import { mount } from "@vue/test-utils"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { defineComponent, h, nextTick, ref, withDirectives } from "vue"
import { createHaptics, type HapticDirectiveValue, vHaptic } from "../src"
import { stubVibrate } from "./helpers"

let vibrate: ReturnType<typeof stubVibrate>

beforeEach(() => {
    vibrate = stubVibrate(() => true)
})

afterEach(() => {
    stubVibrate(null)
})

describe("v-haptic with the Vibration API", () => {
    const mountButton = (value: () => HapticDirectiveValue) =>
        mount(
            defineComponent({
                setup: () => () =>
                    withDirectives(h("button", "Tap"), [[vHaptic, value()]]),
            }),
        )

    it("vibrates briefly on click", async () => {
        const wrapper = mountButton(() => undefined)

        await wrapper.find("button").trigger("click")

        expect(vibrate).toHaveBeenCalledWith(10)
    })

    it("follows a bound boolean", async () => {
        const enabled = ref<HapticDirectiveValue>(false)
        const wrapper = mountButton(() => enabled.value)

        await wrapper.find("button").trigger("click")
        expect(vibrate).not.toHaveBeenCalled()

        enabled.value = true
        await nextTick()
        await wrapper.find("button").trigger("click")
        expect(vibrate).toHaveBeenCalledTimes(1)
    })

    it("removes its listener on unmount", () => {
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

    it("registers v-haptic", async () => {
        const wrapper = mountTemplate("<button v-haptic>Tap</button>")

        await wrapper.find("button").trigger("click")

        expect(vibrate).toHaveBeenCalledTimes(1)
    })

    it("disables the directive through a reactive option", async () => {
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

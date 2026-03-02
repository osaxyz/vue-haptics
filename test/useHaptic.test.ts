import { describe, it, expect, vi } from "vitest"
import { mount } from "@vue/test-utils"
import { defineComponent, h } from "vue"
import { useHaptic } from "../src/index"

describe("useHaptic", () => {
    it("elements are added on mount and removed on unmount", async () => {
        const append_child_spy = vi.spyOn(document.body, "appendChild")
        const remove_child_spy = vi.spyOn(document.body, "removeChild")

        const TestComponent = defineComponent({
            setup() {
                useHaptic()
                return () => h("div")
            },
        })

        const wrapper = mount(TestComponent)

        await wrapper.vm.$nextTick()

        expect(append_child_spy).toHaveBeenCalledTimes(2)

        const calls = append_child_spy.mock.calls
        expect((calls[0][0] as HTMLElement).tagName).toBe("INPUT")
        expect((calls[1][0] as HTMLElement).tagName).toBe("LABEL")

        wrapper.unmount()

        expect(remove_child_spy).toHaveBeenCalledTimes(2)

        append_child_spy.mockRestore()
        remove_child_spy.mockRestore()
    })

    it("label click is executed when triggerHaptic() is called", async () => {
        const TestComponent = defineComponent({
            setup() {
                const { triggerHaptic } = useHaptic()
                return () => h("button", { onClick: triggerHaptic }, "Click")
            },
        })

        const wrapper = mount(TestComponent)
        await wrapper.vm.$nextTick()

        const label = document.querySelector('label[for="haptic-switch"]') as
            | HTMLLabelElement
            | null
        if (!label) {
            throw new Error("label not found")
        }

        const label_click_spy = vi.spyOn(label, "click")

        await wrapper.find("button").trigger("click")
        await wrapper.vm.$nextTick()

        expect(label_click_spy).toHaveBeenCalledTimes(1)

        label_click_spy.mockRestore()
        wrapper.unmount()
    })
})

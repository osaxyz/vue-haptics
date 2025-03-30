import jsdom from "global-jsdom";
jsdom();

import { assertEquals } from "jsr:@std/assert";
import { describe, it } from "jsr:@std/testing/bdd";
import { assertSpyCall, assertSpyCalls, spy } from "jsr:@std/testing/mock";
import { renderHook } from "@testing-library/react";
import useHaptic from "../src/useHaptic.ts";

describe("useHaptic", () => {
  it("elements are added on mount and removed on unmount", () => {
    // wrap document.body.appendChild and removeChild with spy
    const appendChildSpy = spy(document.body, "appendChild");
    const removeChildSpy = spy(document.body, "removeChild");

    try {
      // render useHaptic hook
      const { unmount } = renderHook(() => useHaptic());

      // verify appendChild is called 3 times
      assertSpyCalls(appendChildSpy, 3);

      // verify tagName of each added element
      const firstElement = appendChildSpy.calls[0].args[0] as HTMLElement;
      const secondElement = appendChildSpy.calls[1].args[0] as HTMLElement;
      const thirdElement = appendChildSpy.calls[2].args[0] as HTMLElement;

      assertEquals(firstElement.tagName, "DIV");
      assertEquals(secondElement.tagName, "INPUT");
      assertEquals(thirdElement.tagName, "LABEL");

      // unmount hook
      unmount();

      // verify removeChild is called 2 times after unmount
      assertSpyCalls(removeChildSpy, 2);
    } finally {
      // restore spy
      appendChildSpy.restore();
      removeChildSpy.restore();
    }
  });

  it("label click is executed when triggerHaptic() is called", () => {
    // render useHaptic hook
    const { result } = renderHook(() => useHaptic());

    // get label element added to document.body
    const label = document.querySelector('label[for="haptic-switch"]') as
      | HTMLLabelElement
      | null;
    if (!label) {
      throw new Error("label not found");
    }

    // wrap label.click with spy
    const labelClickSpy = spy(label, "click");

    try {
      // call vibe()
      result.current.triggerHaptic();

      // verify label.click is called 1 time
      assertSpyCalls(labelClickSpy, 1);
      // verify arguments of call
      assertSpyCall(labelClickSpy, 0, { args: [] });
    } finally {
      labelClickSpy.restore();
    }
  });
});

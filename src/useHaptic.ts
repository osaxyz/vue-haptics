import { useCallback, useEffect, useMemo, useRef } from 'react'
import { detectiOS } from './utils'

const HAPTIC_DURATION = 100

const useHaptic = (): { vibe: () => void } => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const labelRef = useRef<HTMLLabelElement | null>(null)
  const isIOS = useMemo(() => detectiOS(), [])

  useEffect(() => {
    // Create and append input element
    const input = document.createElement('input')
    input.type = 'checkbox'
    input.id = 'haptic-switch'
    input.setAttribute('switch', '')
    input.style.display = 'none'
    document.body.appendChild(input)
    inputRef.current = input

    // Create and append label element
    const label = document.createElement('label')
    label.htmlFor = 'haptic-switch'
    label.style.display = 'none'
    document.body.appendChild(label)
    labelRef.current = label

    // Cleanup function
    return () => {
      document.body.removeChild(input)
      document.body.removeChild(label)
    }
  }, [])

  const vibe = useCallback(() => {
    if (isIOS) {
      labelRef.current?.click()
    } else {
      navigator.vibrate(HAPTIC_DURATION)
    }
  }, [isIOS])

  return { vibe }
}

export default useHaptic

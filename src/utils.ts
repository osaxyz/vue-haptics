/**
 * Utility functions for device detection
 */

/**
 * Detects if the current device is running iOS
 * @returns {boolean} true if the device is running iOS, false otherwise
 */
export const detectiOS = (): boolean => {
    if (typeof navigator === "undefined") {
        return false
    }

    const to_match = [/iPhone/i, /iPad/i, /iPod/i]

    return to_match.some((match_pattern) => {
        return RegExp(match_pattern).exec(navigator.userAgent)
    })
}

/**
 * Detects if the current device is running Android
 * @returns {boolean} true if the device is running Android, false otherwise
 */
export const detectAndroid = (): boolean => {
    if (typeof navigator === "undefined") {
        return false
    }
    const to_match = [/Android/i, /webOS/i, /BlackBerry/i, /Windows Phone/i]

    return to_match.some((match_pattern) => {
        return RegExp(match_pattern).exec(navigator.userAgent)
    })
}

/**
 * Detects if the current device is a mobile device (iOS or Android)
 * @returns {boolean} true if the device is a mobile device, false otherwise
 */
export const detectMobile = (): boolean => {
    return detectiOS() || detectAndroid()
}

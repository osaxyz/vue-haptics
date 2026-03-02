import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { qrcode } from "vite-plugin-qrcode"

export default defineConfig({
    plugins: [vue(), qrcode()],
})

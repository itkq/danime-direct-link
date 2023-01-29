import { defineConfig } from 'vite'
import { crx, defineManifest } from '@crxjs/vite-plugin'

const manifest = defineManifest({
  manifest_version: 3,
  name: 'danime open new tab',
  version: '0.0.8',
  permissions: ["tabs", "scripting"],
  host_permissions: [
    "https://animestore.docomo.ne.jp/animestore/ci_pc?workId=*&partId=*"
  ],
  background: {
    service_worker: "src/background.ts",
  },
})

export default defineConfig({
  plugins: [
    crx({ manifest }),
  ],
})

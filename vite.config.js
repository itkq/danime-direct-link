import { defineConfig } from 'vite'
import { crx, defineManifest } from '@crxjs/vite-plugin'

// matches: ,
const manifest = defineManifest({
  manifest_version: 3,
  name: 'danime direct link',
  version: '0.0.1',
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

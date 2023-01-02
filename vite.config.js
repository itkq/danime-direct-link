import { defineConfig } from 'vite'
import { crx, defineManifest } from '@crxjs/vite-plugin'

// matches: ,
const manifest = defineManifest({
  manifest_version: 3,
  name: 'danime direct link',
  version: '0.0.1',
  content_scripts: [
    {
      matches: ["https://animestore.docomo.ne.jp/animestore/ci_pc?workId=*&partId=*"],
      js: ["src/link.ts"],
    }
  ]
})

export default defineConfig({
  plugins: [
    crx({ manifest }),
  ],
})

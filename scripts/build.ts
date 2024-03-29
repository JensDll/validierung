import fs from 'fs-extra'

import { rootDir, run } from './utils'

const base = `${rootDir}/packages/validierung`

await run('rollup', ['--config', '--configPlugin', 'esbuild'])

console.log()
console.log('Formatting declaration files ...')
await run('pnpm', [
  'exec',
  'prettier',
  '--write',
  'packages/**/dist/index.d.ts'
])

console.log()
console.log('Copying relevant files to publish folder ...')
await Promise.all([
  fs.copy('LICENSE', 'publish/LICENSE'),
  fs.copy('README.md', 'publish/README.md'),
  fs.copy(`${base}/package.json`, 'publish/package.json'),
  fs.copy(`${base}/index.cjs`, 'publish/index.cjs'),
  fs.copy(`${base}/dist`, 'publish/dist', {
    filter(path) {
      // Do not copy the cache folder
      return !/cache$/.test(path)
    }
  })
])

console.log()
console.log('Done! 🎉')

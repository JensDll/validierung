import fs from 'fs-extra'

import { run } from '@validierung/shared'

const basePath = 'packages/validierung'

await run('rollup', ['--config'])

console.log()
console.log('Formatting type declaration files ...')
await run('pnpm', [
  'exec',
  'prettier',
  '--write',
  `packages/**/dist/index.d.ts`
])

console.log()
console.log('Copying relevant files to publish folder ...')
await Promise.all([
  // Copy LICENSE
  fs.copy('LICENSE', 'publish/LICENSE'),
  // Copy README
  fs.copy('README.md', 'publish/README.md'),
  // Copy package.json
  fs.copy(`${basePath}/package.json`, 'publish/package.json'),
  // Copy CommonJS entry point
  fs.copy(`${basePath}/index.cjs`, 'publish/index.cjs'),
  // Copy dist content
  fs.copy(`${basePath}/dist`, `publish/dist`)
])

console.log()
console.log('Done!')

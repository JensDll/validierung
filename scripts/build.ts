import fs from 'fs-extra'

import { packages } from './meta'
import { run } from './utils'

const basePath = 'packages/validierung'

await run('rollup', ['--config'])

console.log()
console.log('Formatting type definition files ...')
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
  // Copy JavaScript bundles
  ...packages.validierung.output.map(({ fileName }) =>
    fs.copy(`${basePath}/dist/${fileName}`, `publish/dist/${fileName}`)
  ),
  // Copy TypeScript definition file
  fs.copy(`${basePath}/dist/index.d.ts`, 'publish/dist/index.d.ts')
])

console.log()
console.log('Done!')

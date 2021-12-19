import { run } from './utils'

async function build() {
  await run('rollup', ['--config'])

  console.log()

  console.log('Formatting type definition file ...')
  await run('pnpm', [
    'exec',
    'prettier',
    '--write',
    `packages/**/dist/index.d.ts`
  ])
}

build()

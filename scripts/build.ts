import { run } from './utils'

async function build() {
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
  console.log('Done!')
}

build()

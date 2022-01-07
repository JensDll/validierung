import { run } from './utils'

console.log('Running rollup in watch mode ...')

await run('rollup', ['--config', '--watch'])

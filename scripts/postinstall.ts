import path from 'path'

import { run } from './utils'
import { vue2Dependents, vue3Dependents } from './meta'

function linkVue2() {
  return vue2Dependents.map(name =>
    run('pnpm', ['link', '--dir', path.resolve('node_modules', name)], {
      cwd: path.resolve('node_modules/vue2')
    })
  )
}

function linkVue3() {
  return vue3Dependents.map(name =>
    run('pnpm', ['link', '--dir', path.resolve('node_modules', name)], {
      cwd: path.resolve('node_modules/vue3')
    })
  )
}

await run('husky', ['install'])
await Promise.all(linkVue3())
await Promise.all(linkVue2())
await run('vue-demi-switch', ['3', 'vue3'])

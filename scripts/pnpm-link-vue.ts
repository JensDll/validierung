import path from 'path'

import { run } from './utils'

function linkVue2() {
  const vue2Dependents = ['@vue/composition-api', 'vue-template-compiler']

  return vue2Dependents.map(name =>
    run('pnpm', ['link', '--dir', path.resolve('node_modules', name)], {
      cwd: path.resolve('node_modules/vue2')
    })
  )
}

function linkVue3() {
  const vue3Dependents = ['@vue/server-renderer', '@vitejs/plugin-vue']

  return vue3Dependents.map(name =>
    run('pnpm', ['link', '--dir', path.resolve('node_modules', name)], {
      cwd: path.resolve('node_modules/vue3')
    })
  )
}
console.log(process.env)
await Promise.all(linkVue3())
await Promise.all(linkVue2())

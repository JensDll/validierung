function readPackage(pkg, context) {
  if (pkg.name === '@vue/composition-api') {
    pkg.peerDependencies.vue2 = pkg.peerDependencies.vue
    delete pkg.peerDependencies.vue
    context.log(`Patch peer dependency in ${pkg.name} (rename vue to vue2)`)
  }

  return pkg
}

module.exports = {
  hooks: {
    readPackage
  }
}

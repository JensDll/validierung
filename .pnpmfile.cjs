function hasVuePeerDependency(pkg) {
  return pkg.peerDependencies && pkg.peerDependencies.vue
}

function readPackage(pkg, context) {
  if (hasVuePeerDependency(pkg)) {
    context.log(`Deleting vue peer dependency for ${pkg.name}`)
    delete pkg.peerDependencies.vue
  }

  return pkg
}

module.exports = {
  hooks: {
    readPackage
  }
}

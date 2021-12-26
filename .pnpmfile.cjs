function hasVuePeerDependency(pkg) {
  return pkg.peerDependencies && pkg.peerDependencies.vue
}

function readPackage(pkg, context) {
  if (hasVuePeerDependency(pkg)) {
    // Maybe vue peer dependencies warnings
    // can be fixed here
  }

  return pkg
}

module.exports = {
  hooks: {
    readPackage
  }
}

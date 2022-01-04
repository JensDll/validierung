function hasVuePeerDependency(pkg) {
  return pkg.peerDependencies && pkg.peerDependencies.vue
}

function readPackage(pkg, context) {
  if (hasVuePeerDependency(pkg)) {
  }

  return pkg
}

module.exports = {
  hooks: {
    readPackage
  }
}

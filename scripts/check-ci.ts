if (process.env.CI === 'true') {
  process.exit(1)
} else {
  process.exit(0)
}

export {}

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/packages/**/__tests__/**/*spec.[jt]s?(x)'],
  modulePathIgnorePatterns: ['<rootDir>/publish'],
  moduleNameMapper: {
    '@validierung/(.*)$': '<rootDir>/packages/$1/src'
  },
  globals: {
    __DEV__: true
  }
}

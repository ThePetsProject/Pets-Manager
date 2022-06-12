/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['build/'],
  coveragePathIgnorePatterns: [
    'node_modules',
    './src/infrastructure/database/models/*',
  ],
  // testMatch: ['!./src/app.ts'],
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 30,
      lines: 50,
      statements: 50,
    },
  },
}

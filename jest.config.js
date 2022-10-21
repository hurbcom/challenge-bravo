const { pathsToModuleNameMapper } = require('ts-jest')

module.exports = {
  // moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
  //   prefix: '<rootDir>'
  // }),
  moduleDirectories: ['node_modules', 'src'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'html', 'text'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  modulePathIgnorePatterns: ['dist', 'node_modules', 'coverage'],
  testMatch: ['**/?(*.)+(spec|test).(js|ts|tsx)'],
  setupFilesAfterEnv: ['./jest.setup.js']
}

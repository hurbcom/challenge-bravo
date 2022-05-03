module.exports = {
    testEnvironment: 'node',
    setupFiles: [
        'dotenv/config',
    ],
    setupFilesAfterEnv: [
        '<rootDir>/test/setup.js',
    ],
    globalSetup: '<rootDir>/test/globalSetup.js',
    globalTeardown: '<rootDir>/test/globalTeardown.js',
};

export default {
    clearMocks: true,
    resetMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    collectCoverageFrom: [
        "./src/**/*.{ts,tsx}",
        "!**/node_modules/**",
        "!./src/**/*.interface.{ts,tsx}",
        "!./src/main.{ts,tsx}",
    ],
    globalSetup: "<rootDir>/jest.global.setup.ts",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    transform: {
        "^.+\\.(t|j)sx?$": "@swc/jest",
    },
};

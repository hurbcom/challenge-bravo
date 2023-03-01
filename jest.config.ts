export default {
    clearMocks: true,
    resetMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    collectCoverageFrom: ["./src/**/*.{ts,tsx}", "!**/node_modules/**"],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    transform: {
        "^.+\\.(t|j)sx?$": "@swc/jest",
    },
};

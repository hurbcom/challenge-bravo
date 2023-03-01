export default {
    clearMocks: true,
    resetMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    collectCoverageFrom: ["./src/**/*.{ts,tsx}", "!**/node_modules/**"],
    transform: {
        "^.+\\.(t|j)sx?$": "@swc/jest",
    },
};

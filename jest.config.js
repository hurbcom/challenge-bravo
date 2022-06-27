const path = require("path");

module.exports = {
    moduleFileExtensions: ["js", "json", "ts"],
    rootDir: "src",
    testRegex: ".*spec\\.ts$",
    clearMocks: true,
    transform: {
        "^.+\\.(t|j)s$": "ts-jest",
    },
    collectCoverageFrom: ["**/*.(t|j)s"],
    coverageDirectory: "../coverage",
    testEnvironment: "node",
    moduleNameMapper: {
        "^@/(.*)$": path.resolve(__dirname, "./src/$1"),
    },
    setupFilesAfterEnv: ["<rootDir>/tests/setup/env.ts"],
};

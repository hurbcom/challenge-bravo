const { defaults: tsjPreset } = require("ts-jest/presets");

module.exports = {
    preset: "@shelf/jest-mongodb",
    transform: tsjPreset.transform,
    testEnvironment: "node",
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    coverageReporters: ["html"],
    collectCoverageFrom: ["./src/**"],
};

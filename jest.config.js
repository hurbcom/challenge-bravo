module.exports = {
    bail: true,
    clearMocks: true,
    coverageProvider: "v8",
    setupFiles: ["dotenv/config"],
    testMatch: [
        "**/__tests__/**/*.test.js?(x)",
    ],
};

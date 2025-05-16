module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    verbose: true,
    // Increase the timeout for tests to allow for database operations
    testTimeout: 30000
};

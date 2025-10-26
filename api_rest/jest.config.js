module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/rest/test/**/*.test.js'],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/app.js'
    ],
    coverageReporters: ['text', 'lcov', 'html'],
    setupFiles: ['<rootDir>/jest.setup.js']
};

const { defineConfig } = require("eslint/config");
const js = require("@eslint/js");
const prettierConfig = require("eslint-config-prettier");

module.exports = defineConfig([
    // Specify files to ignore - this should be a separate config object with only ignores property
    {
        ignores: [
            "**/node_modules/**",
            "**/coverage/**",
            "**/.env",
            "**/.env.*"
        ]
    },

    // Use the recommended JS configuration as a base
    js.configs.recommended,

    // Basic ESLint configuration
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "commonjs",
            globals: {
                // NodeJS globals
                require: "readonly",
                module: "readonly",
                exports: "writable",
                process: "readonly",
                __dirname: "readonly",
                __filename: "readonly",
                console: "readonly",
                // Testing globals
                describe: "readonly",
                it: "readonly",
                expect: "readonly",
                beforeEach: "readonly",
                afterEach: "readonly",
                beforeAll: "readonly",
                afterAll: "readonly",
                jest: "readonly"
            }
        }, rules: {
            // Common JS rules
            "no-unused-vars": "warn",
            "no-console": "off", // Allow console statements in development
            "prefer-const": "error",
            "quotes": ["error", "single"],
            "semi": ["error", "always"]
        },
    },

    // Apply prettier configuration
    prettierConfig,

    // Specify different rules for different file types
    {
        files: ["**/*.test.js", "**/tests/**/*.js"],
        languageOptions: {
            globals: {
                jest: "readonly",
                describe: "readonly",
                it: "readonly",
                expect: "readonly",
                beforeEach: "readonly",
                afterEach: "readonly",
                beforeAll: "readonly",
                afterAll: "readonly"
            }
        },
        rules: {
            // Allow console in test files
            "no-console": "off"
        }
    }
]);

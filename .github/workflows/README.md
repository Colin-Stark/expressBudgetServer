# Express Budget Server CI Workflow

This GitHub Actions workflow automates testing and linting for the Express Budget Server project.

## Workflow Overview

The workflow consists of two main jobs:

1. **Build & Test**: Runs unit tests and collects code coverage reports
2. **Lint**: Performs static code analysis using ESLint

## Workflow Triggers

The CI workflow triggers automatically on:

- **Push** to `main`, `master`, and `dev` branches
- **Pull Requests** targeting `main` or `master` branches

## Build & Test Job

This job performs the following steps:

1. Checks out the repository code using `actions/checkout@v4`
2. Sets up Node.js version 22.x using `actions/setup-node@v4`
3. Installs dependencies using `npm ci`
4. Runs tests with `npm test`
5. Uploads test coverage reports as an artifact

### Environment Variables

- **CI**: Set to `true` for CI-specific behavior in tests
- Additional environment variables can be configured by uncommenting and setting values (e.g., `MONGODB_URI`)

## Lint Job

This job performs static code analysis:

1. Checks out the repository code
2. Sets up Node.js 22.x
3. Installs dependencies
4. Installs ESLint (if not already in the project's dependencies)
5. Runs ESLint on all JavaScript files in the project

The linting step runs with `continue-on-error: true`, making it a non-blocking step - build success doesn't depend on passing linting rules.

## Artifacts

The workflow generates and stores:

- **Coverage reports**: Available as downloadable artifacts for each build
- Each artifact is named `coverage-report-node-22.x` based on the Node.js version used

## Local Execution

To simulate this CI workflow locally before pushing:

1. Install dependencies: `npm ci`
2. Run tests: `npm test`
3. Run linting: `npx eslint . --ext .js`

## Configuration

To modify the workflow:

1. Edit `.github/workflows/ci.yml`
2. Commit and push changes to the repository

## Additional Notes

- The workflow uses caching for npm dependencies to speed up builds
- It currently runs on Ubuntu latest for all jobs
- Only Node.js 22.x is tested to ensure compatibility with the latest stable release
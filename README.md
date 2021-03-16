# Divorce IDAM Express Test Harness

A test harness for the IDAM-Express-Middleware

## Requirements

* Node >=8.0
* yarn


## Installation

```bash
# Install the latest version
yarn add "@hmcts/div-idam-test-harness"

# Install a specific version
yarn add "@hmcts/div-idam-test-harness@1.2.1"
```


## Usage

Require this module in your tests and call `idamExpressTestHarness.stub()` before the app is initialised.

Remember to call `.restore()` after every test.


## Publishing to NPM

To publish this artefact to NPM, just create a release in GitHub. GitHub Actions will publish a version in NPM matching the version the packages.json file.

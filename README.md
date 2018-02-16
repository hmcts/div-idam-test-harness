# Divorce IDAM Express Test Harness

A test harness for the IDAM-Express-Middleware

## Requirements

* Node >=8.0
* yarn


## Installation

As of now, this module is published only in a private repository.
We are working on publishing this project to NPM.
Until then, the package can be installed from its github URL, examples:

```bash
# Install the latest version
yarn add https://github.com/hmcts/div-idam-test-harness

# Install a specific version
yarn add https://github.com/hmcts/div-idam-test-harness#1.0.11
```


## Usage

Require this module in your tests and call `idamExpressTestHarness.stub()` before the app is initialised.

Remember to call `.restore()` after every test.

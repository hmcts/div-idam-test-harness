/**
 * The following example is for Pact version 5
 */
const path = require('path');
const chai = require('chai');
const { Pact, Matchers } = require('@pact-foundation/pact');
const chaiAsPromised = require('chai-as-promised');
const config = require('../config');
const getPort = require('get-port');
const userDetails = require('@hmcts/div-idam-express-middleware');
const httpStatusCodes = require('http-status-codes');

const assert = chai.assert;
const { like } = Matchers;

chai.use(chaiAsPromised);

describe('Pact SidamService consumer', () => {
  // eslint-disable-next-line init-declarations
  let MOCK_SERVER_PORT;
  // eslint-disable-next-line init-declarations
  let provider;

  const MOCK_USER_ID = 41;

  getPort().then(portNumber => {
    MOCK_SERVER_PORT = portNumber;
    // (1) Create the Pact object to represent your provider
    provider = new Pact({
      consumer: 'divorce_frontend',
      provider: 'sidam',
      port: MOCK_SERVER_PORT,
      log: path.resolve(process.cwd(), 'logs', 'pactAuthoriseClient.log'),
      dir: path.resolve(process.cwd(), config.services.pact.pactDirectory),
      logLevel: 'INFO',
      spec: 2
    });
  });

  // Setup a Mock Server before unit tests run.
  // This server acts as a Test Double for the real Provider API.
  // We then call addInteraction() for each test to configure the Mock Service
  // to act like the Provider
  // It also sets up expectations for what requests are to come, and will fail
  // if the calls are not seen.
  before(() => {
    provider.setup();
  });

  // After each individual test (one or more interactions)
  // we validate that the correct request came through.
  // This ensures what we _expect_ from the provider, is actually
  // what we've asked for (and is what gets captured in the contract)
  afterEach(() => {
    provider.verify();
  });

  describe('when a request for the idam user details', () => {
    describe('is required from a GET', () => {
      before(() => {
        provider.addInteraction({
          // The 'state' field specifies a 'Provider State'
          state: 'a valid user is logged on',
          uponReceiving: 'a request for the idam user details',
          withRequest: {
            method: 'GET',
            path: '/details',
            headers: {
              'Content-Type': 'application/json',
              Authorization: like('Bearer securityCookie')
            }
          },
          willRespondWith: {
            status: httpStatusCodes.OK,
            body: {
              forename: like('User'),
              surname: like('Test'),
              defaultService: like('CCD'),
              id: like(MOCK_USER_ID),
              roles: like([
                'caseworker-probate',
                'citizen',
                'caseworker',
                'caseworker-probate-loa1',
                'citizen-loa1',
                'caseworker-loa1'
              ])
            }
          }
        });
      });

      it('successfully returns details', done => {
        const verificationPromise = userDetails.userDetails({ idamApiUrl: `http://localhost: ${MOCK_SERVER_PORT}` });
        assert.eventually.ok(verificationPromise).notify(done);
      });
    });
  });

  // Write pact files
  after(() => {
    return provider.finalize();
  });
});

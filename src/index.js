const sinon = require('sinon');
const request = require('request-promise-native');
const idamExpress = require('@hmcts/div-idam-express-middleware');
const socksAgent = require('socks5-https-client/lib/Agent');
const url = require('url');

const DEFAULT_PORT = 9000;

const onAuthenticate = () => {
  return (req, res, next) => {
    next();
  };
};

const onLanding = () => {
  return (req, res, next) => {
    next();
  };
};

const onProtect = () => {
  return (req, res, next) => {
    next();
  };
};

const stub = () => {
  sinon.stub(idamExpress, 'authenticate').callsFake(onAuthenticate);
  sinon.stub(idamExpress, 'landingPage').callsFake(onLanding);
  sinon.stub(idamExpress, 'protect').callsFake(onProtect);
};

const restore = () => {
  idamExpress.authenticate.restore();
  idamExpress.landingPage.restore();
  idamExpress.protect.restore();
};

const setupProxy = proxy => {
  const proxyUrl = url.parse(proxy);

  let proxyOptions = {};

  if (proxyUrl.protocol.indexOf('socks') >= 0) {
    proxyOptions = {
      strictSSL: false,
      agentClass: socksAgent,
      socksHost: proxyUrl.hostname || 'localhost',
      socksPort: proxyUrl.port || DEFAULT_PORT
    };
  } else {
    proxyOptions = { proxy: proxyUrl.href };
  }

  return proxyOptions;
};

const createUser = (args, proxy) => {
  const endpoint = args.accountsEndpoint || '/testing-support/accounts';
  const userGroup = args.testGroupCode || 'divorce-private-beta';
  // Minimum required fields
  const user = {
    email: args.testEmail || 'testUser@example.com',
    forename: args.testForename || 'Test',
    surname: args.testSurname || 'User',
    userGroup: { code: userGroup },
    password: args.testPassword || 'passWord123!',
    levelOfAccess: args.testLevelOfAccess || '1'
  };

  const options = {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  };

  if (proxy) {
    Object.assign(options, setupProxy(proxy));
  }

  return request.post(args.idamApiUrl + endpoint, options);
};

const removeUser = (args, proxy) => {
  const endpoint = args.accountsEndpoint || '/testing-support/accounts';
  const email = args.testEmail || 'testUser@example.com';

  let options = {};
  if (proxy) {
    options = setupProxy(proxy);
  }

  return request.delete(`${args.idamApiUrl + endpoint}/${email}`, options);
};

module.exports = {
  onAuthenticate,
  onLanding,
  onProtect,
  stub,
  restore,
  createUser,
  removeUser
};

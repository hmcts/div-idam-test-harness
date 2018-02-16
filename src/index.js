const sinon = require('sinon');
const request = require('request-promise-native');
const idamExpress = require('@hmcts/div-idam-express-middleware');

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

const createUser = args => {
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

  return request.post(args.idamApiUrl + endpoint, options);
};

const removeUser = args => {
  const endpoint = args.accountsEndpoint || '/testing-support/accounts';
  const email = args.testEmail || 'testUser@example.com';

  return request.delete(`${args.idamApiUrl + endpoint}/${email}`);
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

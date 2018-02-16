const sinon = require('sinon');
const { expect } = require('chai');
const request = require('request-promise-native');
const idamExpress = require('@hmcts/div-idam-express-middleware');
const testHarness = require('./index');

describe('test harness unit tests', () => {
  const idamApiUrl = 'http://localhost:8080';
  let args = null;
  let postStub = null;
  let deleteStub = null;

  describe('#onAuthenticate', () => {
    beforeEach(() => {
      args = { idamApiUrl };
      testHarness.stub();
    });

    afterEach(() => {
      testHarness.restore();
    });

    it('calls next when authenticate is called', () => {
      const req = {};
      const res = {};
      const nextStub = sinon.spy();

      idamExpress.authenticate()(req, res, nextStub);

      expect(nextStub.calledOnce).to.equal(true);
    });
  });

  describe('#onLanding', () => {
    beforeEach(() => {
      args = { idamApiUrl };
      testHarness.stub();
    });

    afterEach(() => {
      testHarness.restore();
    });

    it('calls next when landingPage is called', () => {
      const req = {};
      const res = {};
      const nextStub = sinon.spy();

      idamExpress.landingPage()(req, res, nextStub);

      expect(nextStub.calledOnce).to.equal(true);
    });
  });

  describe('#onProtect', () => {
    beforeEach(() => {
      args = { idamApiUrl };
      testHarness.stub();
    });

    afterEach(() => {
      testHarness.restore();
    });

    it('calls next when protect is called', () => {
      const req = {};
      const res = {};
      const nextStub = sinon.spy();

      idamExpress.protect()(req, res, nextStub);

      expect(nextStub.calledOnce).to.equal(true);
    });
  });

  describe('#createUser', () => {
    beforeEach(() => {
      args = { idamApiUrl };
      postStub = sinon.stub(request, 'post');
    });

    afterEach(() => {
      postStub.restore();
    });

    it('does not return an error when creating a user with difficult values', () => {
      postStub.returns('success');

      expect(() => {
        testHarness.createUser(args);
      }).to.not.throw();
      expect(request.post.calledWith(`${idamApiUrl}/testing-support/accounts`)).to.equal(true);
    });

    it('returns an error when trying to create a user with invalid values', () => {
      postStub.throws();

      expect(() => {
        testHarness.createUser(args);
      }).to.throw();
    });

    it('makes the post call using the passed in params', () => {
      const extendedArgs = Object.assign({}, args, {
        accountsEndpoint: '/accounts',
        testGroupCode: 'test',
        testEmail: 'mail@example.com',
        testForename: 'John',
        testSurname: 'Smith',
        testPassword: 'password',
        testLevelOfAccess: '3'
      });

      postStub.returns('success');

      expect(() => {
        testHarness.createUser(extendedArgs);
      }).to.not.throw();
      expect(request.post.calledWith(`${idamApiUrl}/accounts`)).to.equal(true);
    });
  });

  describe('#removerUser', () => {
    beforeEach(() => {
      args = { idamApiUrl };
      deleteStub = sinon.stub(request, 'delete');
    });

    afterEach(() => {
      deleteStub.restore();
    });

    it('does not return an error when removing a created user', () => {
      deleteStub.returns('success');

      expect(() => {
        testHarness.removeUser(args);
      }).to.not.throw();
      expect(request.delete.calledWith(`${idamApiUrl}/testing-support/accounts/testUser@example.com`)).to.equal(true);
    });

    it('returns an error when trying to create a user with invalid values', () => {
      deleteStub.throws();

      expect(() => {
        testHarness.removeUser(args);
      }).to.throw();
    });

    it('makes the post call using the passed in params', () => {
      const extendedArgs = Object.assign({}, args, {
        accountsEndpoint: '/accounts',
        testEmail: 'mail@example.com'
      });

      deleteStub.returns('success');

      expect(() => {
        testHarness.removeUser(extendedArgs);
      }).to.not.throw();
      expect(request.delete.calledWith(`${idamApiUrl}/accounts/mail@example.com`)).to.equal(true);
    });
  });
});

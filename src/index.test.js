const sinon = require('sinon');
const { expect } = require('chai');
const request = require('request-promise-native');
const socksAgent = require('socks5-https-client/lib/Agent');
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

    it('uses the socks proxy when creating a user with a socks proxy set', () => {
      const extendedArgs = Object.assign({}, args, { testGroupCode: 'test' });
      const proxy = 'socks5://proxyhost:8080';

      const expectedOptions = {
        headers: { 'Content-Type': 'application/json' },
        body: '{"email":"testUser@example.com","forename":"Test","surname":"User","userGroup":{"code":"test"},"password":"passWord123!","levelOfAccess":"1"}',
        strictSSL: false,
        agentClass: socksAgent,
        socksHost: 'proxyhost',
        socksPort: '8080'
      };

      postStub.returns('success');

      expect(() => {
        testHarness.createUser(extendedArgs, proxy);
      }).to.not.throw();

      expect(request.post.calledWith(`${idamApiUrl}/testing-support/accounts`, expectedOptions)).to.equal(true);
    });

    it('uses the http proxy when creating a user with a http proxy set', () => {
      const extendedArgs = Object.assign({}, args, { testGroupCode: 'test' });
      const proxy = 'http://proxyhost:8080';

      const expectedOptions = {
        headers: { 'Content-Type': 'application/json' },
        body: '{"email":"testUser@example.com","forename":"Test","surname":"User","userGroup":{"code":"test"},"password":"passWord123!","levelOfAccess":"1"}',
        proxy: 'http://proxyhost:8080/'
      };

      postStub.returns('success');

      expect(() => {
        testHarness.createUser(extendedArgs, proxy);
      }).to.not.throw();

      expect(request.post.calledWith(`${idamApiUrl}/testing-support/accounts`, expectedOptions)).to.equal(true);
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

  describe('#getToken', () => {
    beforeEach(() => {
      args = {
        idamApiUrl,
        idamClientID: 'some-client-id',
        idamSecret: 'some-secret',
        redirectUri: 'some-redirect-uri'
      };
      postStub = sinon.stub(request, 'post');
    });

    afterEach(() => {
      postStub.restore();
    });

    it('does not return an error when getting a token', done => {
      postStub.onFirstCall()
        .resolves({ code: '123' });
      postStub.onSecondCall()
        .returns('some-token-response');

      testHarness.getToken(args)
        .then(response => {
          expect(request.post.calledWith(`${idamApiUrl}/oauth2/authorize?response_type=code&client_id=some-client-id&redirect_uri=some-redirect-uri`))
            .to.equal(true);
          expect(request.post.calledWith(`${idamApiUrl}/oauth2/token?code=123&grant_type=authorization_code&client_id=some-client-id&redirect_uri=some-redirect-uri&client_secret=some-secret`))
            .to.equal(true);
          expect(response)
            .to.equal('some-token-response');
          done();
        })
        .catch(error => {
          done(error);
        });
    });

    it('returns an error when request fails', () => {
      postStub.throws();

      expect(() => {
        testHarness.getToken(args);
      }).to.throw();
    });

    it('makes the post call using the passed in params', done => {
      const extendedArgs = Object.assign({}, args, {
        authorizeEndpoint: '/auth-endpoint',
        tokenEndpoint: '/token-endpoint'
      });

      postStub.onFirstCall()
        .resolves({ code: '123' });
      postStub.onSecondCall()
        .returns('some-token-response');

      testHarness.getToken(extendedArgs)
        .then(response => {
          expect(request.post.calledWith(`${idamApiUrl}/auth-endpoint?response_type=code&client_id=some-client-id&redirect_uri=some-redirect-uri`))
            .to.equal(true);
          expect(request.post.calledWith(`${idamApiUrl}/token-endpoint?code=123&grant_type=authorization_code&client_id=some-client-id&redirect_uri=some-redirect-uri&client_secret=some-secret`))
            .to.equal(true);
          expect(response)
            .to.equal('some-token-response');
          done();
        })
        .catch(error => {
          done(error);
        });
    });
  });

  describe('#generatePin', () => {
    beforeEach(() => {
      args = { idamApiUrl };
      postStub = sinon.stub(request, 'post');
    });

    afterEach(() => {
      postStub.restore();
    });

    it('does not return an error when generating a pin', () => {
      postStub.returns('success');

      expect(() => {
        testHarness.generatePin(args);
      }).to.not.throw();
      expect(request.post.calledWith(`${idamApiUrl}/pin`)).to.equal(true);
    });

    it('returns an error when trying to generate throws an error', () => {
      postStub.throws();

      expect(() => {
        testHarness.generatePin(args);
      }).to.throw();
    });

    it('makes the post call using the passed in params', () => {
      const extendedArgs = Object.assign({}, args, {
        generatePinEndpoint: '/some-pin-endpoint',
        firstName: 'some-first-name',
        lastName: 'some-last-name',
        roles: ['123']
      });

      postStub.returns('success');

      expect(() => {
        testHarness.generatePin(extendedArgs);
      }).to.not.throw();
      expect(request.post.calledWith(`${idamApiUrl}/some-pin-endpoint`)).to.equal(true);
    });
  });
});

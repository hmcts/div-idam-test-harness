'use strict';

const expect = require('chai').expect;
const testConfig = require('../config');
const request = require('supertest');
const statusCodes = require('http-status-codes');

const prepareBody = () => {
  return {
    // use test harness to retrieve it from Idam
    code: '',
    grant_type: 'authorization_code',
    redirect_uri: testConfig.services.idam.redirect_url,
    client_id: testConfig.services.idam.service_name,
    client_secret: testConfig.services.idam.divorce_oauth2_secret
  };
};

describe('Access token', () => {
  const endpoint = `${testConfig.services.idam.apiUrl}/oauth2/token`;

  // beforeAll
  // create user
  // authorised - for code

  // afterAll
  // removeUser

  describe('Should return 401 when', () => {
    it('No Authorisation header set', done => {
      request(endpoint)
        .type('form')
        .set('Accept', 'application/json')
        .send(prepareBody())
        .expect(statusCodes.BAD_REQUEST)
        .end((error, res) => {
          if (error) {
            done(error);
          } else {
            expect(res.text).to.contain('Bad Request');
            expect(error).to.be.equal(null);
            done();
          }
        });
    });

    it('Invalid Authorisation header', done => {
      request(endpoint)
        .post()
        .type('form')
        .set('Accept', 'application/json')
        .set('Authorization', 'invalid token')
        .type('form')
        .send(prepareBody())
        .expect(statusCodes.BAD_REQUEST)
        .end((error, res) => {
          if (error) {
            done(error);
          } else {
            expect(error).to.be.equal(null);
            expect(res.text).to.contain('Bad Request');
          }
          done();
        });
    });
  });

  describe('Should return 200 when', () => {
    it('Valid Authorisation header provided', done => {
      // call
      done();
    });
  });
});

'use strict';

const expect = require('chai').expect;
const testConfig = require('../config');
const request = require('supertest');
const statusCodes = require('http-status-codes');

describe('Get User Details', () => {
  const endpoint = `${testConfig.services.idam.apiUrl}/details`;

  // beforeAll
  // create user
  // authorised - for code

  // afterAll
  // removeUser

  describe('Should return 200 when', () => {
    // use test-harness to create user and authorise him to get a token

    it('valid header provided', done => {
      request(endpoint)
        .get()
        .set()
        .expect(statusCodes.OK)
        .end((error, res) => {
          if (error) {
            done(error);
          } else {
            expect(error).to.be.equal(null);
            expect(res.text).to.contain('Bad Request');
            done();
          }
        });
    });
  });

  describe('Should return 401 when', () => {
    it('no headers provided', done => {
      request(endpoint)
        .get()
        .expect(statusCodes.UNAUTHORIZED)
        .end((error, res) => {
          if (error) {
            done(error);
          } else {
            expect(error).to.be.equal(null);
            expect(res.text).to.contain('Bad Request');
            done();
          }
        });
    });

    it('invalid headers provided', done => {
      request(endpoint)
        .get()
        .set('Authorization', 'Bearer This-is-invalid-header!!!!')
        .expect(statusCodes.UNAUTHORIZED)
        .end((error, res) => {
          if (error) {
            done(error);
          } else {
            expect(error).to.be.equal(null);
            expect(res.text).to.contain('Bad Request');
            done();
          }
        });
    });
  });
});
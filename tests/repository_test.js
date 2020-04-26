const chai = require('chai');
const chaiHttp = require('chai-http');
const mocha = require('mocha');
const repository = require('../src/repository.js');

chai.use(chaiHttp);
chai.should();

describe('repository', () => {
  describe('.userPunches', () => {
     it('returns all user punches of a given day', (done) => {
    })
  })

  describe('.allUserPunches', () => {
     it('returns all user indiscriminate punches', (done) => {
    })
  })
})

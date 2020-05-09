const expect = require('chai').expect;
const chaiHttp = require('chai-http');
const mocha = require('mocha');
const repository = require('../src/repository.js');

describe('repository', () => {

  before((done) => repository.createCollections(done))

  describe('.userPunches', () => {
     it('returns all user punches of a given day', (done) => {

      const user_id = 'abc123';
      const date = '1998-01-01';

      repository.savePunch(user_id, date, '08:00', 'punch', (err, res) => {
        repository.userPunches(user_id, date, (err, punches) => {
          expect(punches.length).to.equal(1);
          done();
        })
      });
    })
  })
});
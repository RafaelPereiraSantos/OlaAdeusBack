const chai = require('chai');
const chaiHttp = require('chai-http');
const mocha = require('mocha');
const app = require('../src/index.js');

chai.use(chaiHttp);
chai.should();

describe('logged routes', () => {
  describe('when request without sesion', () => {
    it('returns 401 unauthorizeda', (done) => {
      chai.request(app)
          .get('/user')
          .end((error, res) => {
            res.should.have.status(401);
            done();
          })
    })
  })
});

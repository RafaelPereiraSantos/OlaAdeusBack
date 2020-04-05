const chai = require('chai');
const chaiHttp = require('chai-http');
const mocha = require('mocha');
const app = require('../src/index.js');

chai.use(chaiHttp);
chai.should();

describe('health', () => {
  describe('get /', () => {
    it('returns that everthing is OK and thanks for asking', (done) => {
      chai.request(app)
          .get('/health')
          .end((error, resp) => {
            res.should.have.status(200);
            res.body.should.be("I'm fine, thanks for asking!");
            done();
          })
    })
  })
})
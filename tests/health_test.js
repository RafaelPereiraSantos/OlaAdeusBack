const chai = require('chai');
const chaiHttp = require('chai-http');
const mocha = require('mocha');
const app = require('../src/index.js');

chai.use(chaiHttp);
chai.should();

describe('health', () => {
  describe('get /', () => {
    it('returns that everthing is OK and thanks us for asking', (done) => {
      chai.request(app)
          .get('/health')
          .end((error, res) => {
            res.should.have.status(200);
            res.text.should.equal("I'm fine, thanks for asking!");
            done();
          })
    })
  })
});

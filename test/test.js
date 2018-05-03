//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');

chai.use(chaiHttp);

let expect = chai.expect;

describe('/users/:id/groups', () => {

    it('Asking for all groups with id matching auth. Should get an array and 200 code.', (done) => {
        chai.request(server).
        get('/user/1/groups').
        auth('test@test.com', 'test123').
        end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.eql([]);
            done();
        })
    });

    it('Asking for all groups of id not matching auth. Should get 401.', (done) => {
        chai.request(server).
        get('/user/55/groups').
        auth('test@test.com', 'test123').
        end((err, res) => {
            expect(res).to.have.status(401);
            done();
        })
    });

});


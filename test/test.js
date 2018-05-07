//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const assert = require('chai').assert;

chai.use(chaiHttp);

let expect = chai.expect;

describe('/user/', () => {

    it('Sends new user info in body. Valid fields. Should get back 200.', (done) => {
        chai.request(server).
        post('/user/').
        send({
            'email': 'test@test.com',
            'password': 'Test123!',
            'fn': 'John',
            'ln': 'Doe'
        }).
        end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.eql('Sign up successful.');
            done();
        })
    });

    it('Sends new user info in body. Invalid email. Should get back 400.', (done) => {
        chai.request(server).
        post('/user/').
        send({
            'email': 'test@test[com',
            'password': 'Test123!',
            'fn': 'John',
            'ln': 'Doe'
        }).
        end((err, res) => {
            //expect(res).to.have.status(400); TODO: <-
            expect(res.body).to.be.eql('Sign up failed. Invalid email.');
            done();
        })
    });

    it('Sends new user info in body. Invalid password. Should get back 400.', (done) => {
        chai.request(server).
        post('/user/').
        send({
            'email': 'test@test.com',
            'password': 'test12',
            'fn': 'John',
            'ln': 'Doe'
        }).
        end((err, res) => {
            //expect(res).to.have.status(400); TODO: <-
            expect(res.body).to.be.eql('Sign up failed. Invalid password.');
            done();
        })
    });

    it('Sends new user info in body. Invalid email AND password. Should get back 400.', (done) => {
        chai.request(server).
        post('/user/').
        send({
            'email': 'test@test]com',
            'password': 'test12',
            'fn': 'John',
            'ln': 'Doe'
        }).
        end((err, res) => {
            //expect(res).to.have.status(400); TODO: <-
            // Should only see the invalid email message. TODO: Send both errors?
            expect(res.body).to.be.eql('Sign up failed. Invalid email.');
            done();
        })
    });

    it('Sends new user info in body. First name is empty string. Should get back 400.', (done) => {
        chai.request(server).
        post('/user/').
        send({
            'email': 'test@test.com',
            'password': 'Test123!',
            'fn': '',
            'ln': 'Doe'
        }).
        end((err, res) => {
            //expect(res).to.have.status(400); TODO: <-
            expect(res.body).to.be.eql('Sign up failed. Sign up requires first and last name and must be string.');
            done();
        })
    });

    it('Sends new user info in body. First name is an int. Should get back 400.', (done) => {
        chai.request(server).
        post('/user/').
        send({
            'email': 'test@test.com',
            'password': 'Test123!',
            'fn': 23,
            'ln': 'Doe'
        }).
        end((err, res) => {
            //expect(res).to.have.status(400); TODO: <-
            expect(res.body).to.be.eql('Sign up failed. Sign up requires first and last name and must be string.');
            done();
        })
    });

});

// Below is commented out until prior tests are build to populate database.

/*
describe('/user/:id/groups', () => {

    it('Asking for all groups with id matching auth. Response should be type of array and status 200.', (done) => {
        chai.request(server).
        get('/user/1/groups').
        auth('test@test.com', 'Test123!').
        end((err, res) => {
            expect(res).to.have.status(200);
            assert.typeOf(res.body, 'array');
            done();
        })
    });

    it('Asking for all groups of id not matching auth. Response status should be 403.', (done) => {
        chai.request(server).
        get('/user/2/groups').
        auth('test@test.com', 'Test123!').
        end((err, res) => {
            expect(res).to.have.status(403);
            done();
        })
    });

});
*/


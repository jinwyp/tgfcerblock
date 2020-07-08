/**
 * Created by jin on 9/18/17.
 */

const env = process.env.NODE_ENV || 'test'


//Require the dev-dependencies
const expect = require('chai').expect
const should = require('chai').should()
const supertest = require('supertest')

const config = require('../testConfig')
const server = supertest(config.path.urlApi)



describe('First test', () => {
    it('Should assert true to be true', () => {
        expect(true).to.be.true;
    });
});


describe('用户登陆', function () {


    it('登陆失败', function (done) {
        server.post('/api/user/login')
            .set('Accept', 'application/json')
            .send({
                username: "jinwyp1",
                password: "1234567"
            })
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function(err, res) {
                if (err) return done(err)
                done()
            })
    })


    it('登陆成功', function (done) {
        server.post('/api/user/login')
            .set('Accept', 'application/json')
            .send({
                username: "jinwyp1",
                password: "123456"
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err)
                expect(res.body.data).to.have.property("accessToken")
                done()
            })
    })


})
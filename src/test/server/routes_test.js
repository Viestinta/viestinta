
const should = require('should')
const request = require('supertest');
const app = require('../../server/app').app;
const lectureController = require('../../server/database/controllers/lectures')
const courseController = require('../../server/database/controllers/courses')


describe('GET /', function() {

  it('Test 200 and HTML', function (done) {
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err)
        }
        done()
      })
  })
})


describe('GET /lectures', function() {
  it('Unauthorized', function(done) {
    process.env.NODE_ENV = 'test_dev'
    request(app)
      .get('/lectures')
      .set('Accept', 'application/json')
      .expect(401)
      .end(function(err, res) {
        if (err) {
          return done(err)
        }
        done()
      })
  })

  /*
  it('Authorized, 404', function(done) {
    process.env.NODE_ENV = 'test'
    request(app)
      .get('/lectures')
      .set('Accept', 'application/json')
      .expect(404)
      .end(function(err, res) {
        if (err) return done(err)
        done()
      })
  })
  */

  it('Authorized, 200', function(done) {
    process.env.NODE_ENV = 'test'
    request(app)
      .get('/lectures')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err)
        done()
      })
  })
})
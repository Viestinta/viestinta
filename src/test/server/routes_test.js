
const should = require('should')
const request = require('supertest');
const app = require('../../server/app').app;
const lectureController = require('../../server/database/controllers/lectures')
const courseController = require('../../server/database/controllers/courses')

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
        res.user = 'Test'
        done()
      })
  })

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

  let testCourse = undefined
  let testLecture = undefined
  it('Authorized, 200', function(done) {
    courseController.findOrCreateCourse({
      name: "API TEST",
      code: "API01"
    }).spread(function(course, created) {
      testCourse = course
      lectureController.createLecture({
        name: "Test Lecture API",
        CourseId: testCourse.id
      }).then(function (lecture) {
        testLecture = lecture
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
  })
  
  after(function (done) {
    testLecture.destroy().then(function () {
      testCourse.destroy().then(function () {
        done()
      })
    })
  })
})q
/*
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

  let testCourse
  let testLecture

  before(function (done) {
    courseController.findOrCreateCourse({
      name: "APICourse",
      code: "API101"
    }).spread(function (course, created) {
      testCourse = course
      lectureController.createLecture({
        name: "APILecture",
        CourseId: testCourse.id
      }).then(function (lecture) {
        testLecture = lecture
        done()
      })
    })
  })

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

  it('Authorized, 404', function(done) {
    process.env.NODE_ENV = 'test'
    lectureController.getAll().then(function (lectures) {
      let counter = 0
      lectures.forEach(function (lecture) {
        lecture.destroy().then(function () {
          counter ++
          if(counter === lectures.length){
            request(app)
              .get('/lectures')
              .set('Accept', 'application/json')
              .expect(404)
              .end(function(err, res) {
                if (err) return done(err)
                done()
              })
          }
        })
      })
    })
  })

  after(function (done) {
    testCourse.destroy().then(function () {
      done()
    })
  })
})
*/
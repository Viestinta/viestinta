// Hack for pg issues
var pg = require('pg')
delete pg.native

var assert = require('assert')
var db = require('../../server/database/models/index')
const feedbackController = require('../../server/database/controllers/feedback')
const lectureController = require('../../server/database/controllers/lectures')
const courseController = require('../../server/database/controllers/courses')
const should = require('should')


describe('Testing feedback: ', function () {

  let testCourse = undefined
  let testLecture = undefined

  let testFeedback1 = undefined
  let testFeedback2 = undefined
  let testFeedback3 = undefined

  before(function (done) {
    courseController.findOrCreateCourse({
      name: "TestCourse",
      code: "TEST0000"
    }).spread(function (course, created) {
      testCourse = course
      lectureController.createLecture({
        name: "TestLecture",
        CourseId: testCourse.id
      }).then(function (lecture) {
        testLecture = lecture
        done()
      })
    })
  })

  it('Text in Feedback object in database is identical to "-1"', function (done) {
    feedbackController.createFeedback({
      value: -1
    }).then(function (feedback) {
      assert.equal(feedback.value, -1)
      feedback.destroy()
      done()
    })
  })

  it('Text in Feedback object in database is identical to "1"', function (done) {
    feedbackController.createFeedback({
      value: 1
    }).then(function (feedback) {
      assert.equal(feedback.value, 1)
      feedback.destroy()
      done()
    })
  })


  it('Date to Feedback object in database is correct', function (done) {
    let testTime = new Date()
    feedbackController.createFeedback({
      time: testTime
    }).then(function (feedback) {
      testTime.getTime().should.equal(feedback.time.getTime())
      feedback.destroy()
      done()
    })
  })

  it('Lecture to feedback object in database is lecture set', function (done) {
    feedbackController.createFeedback({
      value: 1,
      LectureId: testLecture.id,
    }).then(function (feedback) {
      testFeedback1 = feedback
      assert.equal(testFeedback1.LectureId, testLecture.id)
      done()
    })
  })

  it('Get recent positive feedback', function (done) {
    feedbackController.getLastIntervalPos(testLecture)
      .then(function (value) {
        assert.equal(value, 1)
        done()
      })
  })

  it('Get recent negative feedback', function (done) {
    feedbackController.createFeedback({
      value: -1,
      LectureId: testLecture.id
    }).then(function (feedback) {
      testFeedback2 = feedback
      feedbackController.createFeedback({
        value: -1,
        LectureId: testLecture.id
      }).then(function (feedback) {
        testFeedback3 = feedback
        feedbackController.getLastIntervalNeg(testLecture)
          .then(function (value) {
            assert.equal(value, 2)
            done()
          })
      })
    })
  })

  it('Get all feedback', function (done) {
    feedbackController.getAll().then(function (feedback) {
      assert.equal(feedback.length, 3)
      done()
    })
  })

  it('Get all to lecture', function (done) {
    feedbackController.getAllToLecture(testLecture).then(function (feedback) {
      assert.equal(feedback.length, 3)
      done()
    })
  })

  it('Update feedback', function (done) {
    feedbackController.updateFeedback(testFeedback1, {value: -1}).then(function (feedback) {
      assert.equal(feedback.value, testFeedback1.value)
      assert.equal(testFeedback1.value, -1)
      done()
    })
  })

  it('Delete feedback', function (done) {
    feedbackController.deleteFeedback(testFeedback1).then(function () {
      feedbackController.getAll().then(function (feedback) {
        assert.equal(feedback.length,2)
        done()
      })
    })
  })

  after(function (done) {
    testFeedback2.destroy().then(function () {
      testFeedback3.destroy().then(function () {
        testLecture.destroy().then(function () {
          testCourse.destroy().then(function () {
            done()
          })
        })
      })
    })
  })
})

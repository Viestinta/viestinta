// Hack for pg issues
var pg = require('pg')
delete pg.native

var assert = require('assert')
var db = require('../../server/database/models/index')
let messageController = require('../../server/database/controllers/messages')
let lectureController = require('../../server/database/controllers/lectures')
let courseController = require('../../server/database/controllers/courses')
let userController = require('../../server/database/controllers/users')

// Test for database message creation
describe('Testing messages:', function () {

  let testCourse = undefined
  let testLecture = undefined
  let testUser = undefined

  before(function (done) {
      courseController.findOrCreateCourse({
        name: "Web Development",
        code: "TDT404"
      }).spread(function(course, created){
        testCourse = course
        lectureController.createLecture({
          name: "Intro to JS programming",
          CourseId: course.id
        }).then(function (lecture) {
          testLecture = lecture
          userController.findOrCreateUser({
            name: "TestUserForWebDevelopment"
          }).spread(function (user, created) {
            testUser = user
            done()
          })

        })
      })
  })


  it('Text in Message object in database is identical to "Hello world"', function (done) {
    messageController.createMessage({
      text: 'Hello world'
    }).then(function (message) {
      assert.equal(message.text, 'Hello world')
      message.destroy().then(function () {
        done()
      })
    })
  })


  let testDate = new Date()

  let hours = testDate.getHours()
  console.log("Hours: ", hours)
  if (hours < 10) {
    hours = '0' + hours
  }

  let mins = testDate.getMinutes()
  if (mins < 10) {
    mins = '0' + mins
  }


  it('Date to Message object in database is correct', function (done) {
    messageController.createMessage({
      text: 'Hello world',
      time: testDate,
      LectureId: testLecture.id
    }).then(function (message) {
      assert.equal(message.time, hours + ':' + mins)
      message.destroy().then(function () {
        done()
      })
    })
  })


  it('Lecture to Message object in database is lecture set', function (done) {
    messageController.createMessage({
      text: 'Hello world!!!',
      LectureId: testLecture.id
    }).then(function (message) {
        messageController.getAllToLecture(testLecture)
          .then(function (messages) {
            message.setLecture(testLecture.id)
            assert.equal(message.LectureId, testLecture.id)
            assert.equal(messages[0].text, 'Hello world!!!')
            message.destroy().then(function () {
              done()
            })
          })
    })
  })

  it('User to Message object in database is set to correct user', function (done) {
   messageController.createMessage({
      text: 'Hello world',
   })
     .then(function (message) {
        message.setUser(testUser)
        assert.equal(message.UserId, testUser.id)
        message.destroy().then(function () {
          done()
        })
     })
  })

  it('The updated message is correct', function (done) {
    messageController.createMessage({
      text: "Herro world"
    }).then(function (message) {

      let testMessage = message

      messageController.updateMessage(message, {
        text: "Hello world"
      }).then(function () {
          assert.equal(testMessage.text, "Hello world")
          testMessage.destroy().then(function () {
            done()
          })
      })
    })
  })

  it('Get all messages containing specific text', function (done) {
    messageController.createMessage({
      text: "Test505"
    }).then(function (message) {
      let testMessage1 = message
      messageController.createMessage({
        text: "Test606"
      }).then(function (message) {
        let testMessage2 = message

        messageController.getAllByText("Test707")
          .then(function (messages) {
            assert.equal(messages.length, 0)

            messageController.getAllByText("Test606")
              .then(function (messages) {
                assert.equal(messages[0].text, "Test606")
                testMessage1.destroy().then(function () {
                  testMessage2.destroy().then(function () {
                    done()
                  })
                })
            })
        })
      })
    })
  })

  it('The message is deleted successfully', function (done) {
    messageController.createMessage({
      text: "Hello computer"
    }).then(function (message) {
      let testMessage = message
      messageController.deleteMessage(testMessage).then(function () {
        messageController.getAllByText("Hello computer").then(function (messages) {
          assert.equal(messages.length, 0)
          testMessage.destroy().then(function () {
            done()
          })
        })
      })
    })
  })

  after(function (done) {
    testUser.destroy().then(function () {
      testLecture.destroy().then(function () {
        testCourse.destroy().then(function () {
          done()
        })
      })
    })
  })
})
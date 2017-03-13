// Hack for pg issues
var pg = require('pg')
delete pg.native

var User = require('./models/').User
var Lecture = require('./models/').Lecture
var Message = require('./models/').Message
var assert = require('assert')
var db = require('./models/index')

// Test for database message creation
describe('Test suite: Message create', function () {
  
  db[Message].create({
    text: 'Hello world'
  }).then(function (message) {
    it('Text to Message object in database is identical to text set', function (done) {
      assert.equal(message.text, 'Hello world')
      done()
    })

    it('Date to Message object in database is now', function (done) {
      assert.equal(message.time, new Date())
      done()
    })

    db[Lecture].create({}).then( function (lecture) {

      message.setLecture(lecture)

      it('Lecture to Message object in database is lecture set', function (done) {
        assert.equal(message.lectureId, lecture.id)
        done()
      })
    })

    message.destroy()
  }
})
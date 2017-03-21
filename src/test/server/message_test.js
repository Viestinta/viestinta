// Hack for pg issues
var pg = require('pg')
delete pg.native

var assert = require('assert')
var db = require('../../server/database/models/index')

// Test for database message creation
describe('Test suite: Message create', function () {
  describe('Database creation for message: Hello World', function () {
	  it('Text in Message object in database is identical to "Hello world"', function (done) {
		  db['Message'].create({
		    text: 'Hello world'
		  }).then(function (message) {
		    assert.equal(message.text, 'Hello world')
		  	done()
    message.destroy()
		  })
  })
  })

  var hours = new Date().getHours()
	  if (hours < 10) {
	    hours = '0' + hours
	  } else {

	  }
	  var mins = new Date().getMinutes()
	  if (mins < 10) {
	    mins = '0' + mins
	  }

  describe('Get formatted time from message model: ' + hours + ':' + mins, function () {
    it('Date to Message object in database is correct', function (done) {
		  db['Message'].create({
		    text: 'Hello world'
		  }).then(function (message) {
			  assert.equal(message.time, hours + ':' + mins)
			  done()
			  message.destroy()
		  })
    })
  })

	// TODO: failing
	/*
	describe('Set lecture to message: ' + hours + ':' + mins, function () {
		it('Lecture to Message object in database is lecture set', function (done) {

	    db['Message'].create({
		    text: 'Hello world'
		  }).then(function (message) {
				db['Lecture'].create({}).then( function (lecture) {
		      message.setLecture(lecture)
			  	assert.equal(message.lectureId, lecture.id)
		      done()
		      message.destroy()
		    })
			})
		})
  })

  // TODO:  failing
  describe('Set user to message: TestUser', function () {
		it('Lecture to Message object in database is lecture set', function (done) {

	    db['Message'].create({
		    text: 'Hello world'
		  }).then(function (message) {
				db['User'].create({}).then( function (lecture) {
		      message.setUser(user)
			  	assert.equal(message.userId, user.id)
		      done()
		      message.destroy()
		      lecture.destroy()
		    })
			})
		})
  })
	*/
})

// Hack for pg issues
var pg = require('pg')
delete pg.native

var assert = require('assert')
var db = require('../../server/database/models/index')
const should = require('should')

// Test for database message creation
describe('Test suite: Feedback create', function () {
  
	describe('Database creation for feedback: -1', function () {
  
	  it('Text in Feedback object in database is identical to "-1"', function (done) {
		  db['Feedback'].create({
		    value: -1
		  }).then(function (feedback) {
		    assert.equal(feedback.value, -1)
		  	done()
				feedback.destroy()
		  })
		})
	})

	describe('Database creation for feedback: 1', function () {
	  it('Text in Feedback object in database is identical to "1"', function (done) {
		  db['Feedback'].create({
		    value: 1
		  }).then(function (feedback) {
		    assert.equal(feedback.value, 1)
		  	done()
				feedback.destroy()
		  })
		})
	})

	describe('Get time from feedback model: ' + new Date(), function () {
	  var time = new Date()
		it('Date to Feedback object in database is correct' , function (done) {
		  db['Feedback'].create({
		  	time: time
		  }).then(function (feedback) {	
			  var feedbackTime = feedback.time.getTime()
			  feedbackTime.should.equal(time.getTime())
			  done()
			  feedback.destroy()
		  })
		})
	})

	describe('Set lecture to feedback: ', function () {
		it('Lecture to feedback object in database is lecture set', function (done) {
		
	    db['Feedback'].create({
		  }).then(function (feedback) {
				db['Lecture'].create({}).then( function (lecture) {
		      feedback.setLecture(lecture)
			  	assert.equal(feedback.lectureId, lecture.id)
		      done()
		      feedback.destroy()
		      lecture.destroy()
		    })
			})
		})  
  })
})
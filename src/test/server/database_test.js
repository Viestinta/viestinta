// Hack for pg issues
var pg = require('pg')
delete pg.native

var User = require('./models/').User
var assert = require('assert')
var db = require('./models/index')

// Extra test frameworks:
// var should = require('should');

// Defines alphabet to be used
var s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

// Defines the function to generate the names to be used for the test
// Returns a random String with N length and based on the alphabet s

var testNameGenerator = function (N) {
  return Array(N).join().split(',').map(function () { return s.charAt(Math.floor(Math.random() * s.length)) }).join('')
}

// Unique firstName and lastName for each test
var firstName1 = testNameGenerator(10)
var lastName1 = testNameGenerator(10)
var firstName2 = testNameGenerator(10)
var lastName2 = testNameGenerator(10)
var firstName3 = testNameGenerator(10)
var lastName3 = testNameGenerator(10)

// Builds the User object with the corresponding name. Does not save the User objects to the database.
var testUser1 = User.build({firstName: firstName1, lastName: lastName1})
var testUser2 = User.build({firstName: firstName2, lastName: lastName2})
var testUser3 = User.build({firstName: firstName3, lastName: lastName3})

// Creates a tuple array for the test
var testArray = [ [testUser1, firstName1 + ' ' + lastName1],
                    [testUser2, firstName2 + ' ' + lastName2],
                    [testUser3, firstName3 + ' ' + lastName3]
]

// Test for local user creation
describe('Test suite: User build', function () {
  testArray.forEach(function (arrElement, callback) {
    describe('Build test for name: ' + arrElement[0].firstName + ' ' + arrElement[0].lastName, function () {
      it('Name to local User object is identical to name generated', function (done) {
        assert.equal(arrElement[0].firstName + ' ' + arrElement[0].lastName, arrElement[1])
        done()
      })
    })
  })
})

// Get the User object from the database
// Creates a tuple array for the test
var test2Array = [
    [firstName1, lastName1],
    [firstName2, lastName2],
    [firstName3, lastName3]
]

// Test for database user creation
describe('Test suite: User create', function () {
    // For each element in test2Array
  test2Array.forEach(function (arrElement, callback) {
    describe('Database test for name: ' + arrElement[0] + ' ' + arrElement[1], function () {
      it('Name to User object in database is identical to name generated', function (done) {
        // Access database and create the user if it doesn't exist
        db['User']
          .findOrCreate({
            where: {firstName: arrElement[0], lastName: arrElement[1]},
            attributes: ['id', 'firstName', 'lastName']
          })

          // Then compare that user's variables to the variables given
          .spread(function (user, created) {
            assert.equal(
              arrElement[0] + ' ' + arrElement[1],
              user.firstName + ' ' + user.lastName
          )

          // Delete the user from the database
            user.destroy()
            done()
          })
      })
    })
  })
})

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


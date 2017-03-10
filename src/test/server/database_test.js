/**
 * Created by jacob on 20.02.17.
 */
// Hack for pg issues
const path = require('path')
const User = require('../../server/database/models/').User
const assert = require('assert')
const db = require('../../server/database/models/index')

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
var name1 = testNameGenerator(10)
var name2 = testNameGenerator(10)
var name3 = testNameGenerator(10)



// Builds the User object with the corresponding name. Does not save the User objects to the database.
var testUser1 = User.build({name: name1})
var testUser2 = User.build({name: name2})
var testUser3 = User.build({name: name3})

// Creates a tuple array for the test
var testArray = [ [testUser1, name1],
                    [testUser2, name2],
                    [testUser3, name3]
]

// Test for local user creation
describe('Test suite: User build', function () {
  testArray.forEach(function (arrElement, callback) {
    describe('Build test for name: ' + arrElement[0].name, function () {
      it('Name to local User object is identical to name generated', function (done) {
        assert.equal(arrElement[0].name, arrElement[1])
        done()
      })
    })
  })
})

// Get the User object from the database
// Creates a tuple array for the test
var test2Array = [
    name1, name2, name3
]

// Test for database user creation
describe('Test suite: User create', function () {
    // For each element in test2Array
  test2Array.forEach(function (arrElement, callback) {
    describe('Database test for name: ' + arrElement, function () {
      it('Name to User object in database is identical to name generated', function (done) {
                // Access database and create the user if it doesn't exist
        db['User']
                    .findOrCreate({
                      where: {name:arrElement},
                      attributes: ['name']
                    })

                    // Then compare that user's variables to the variables given
                    .spread(function (user, created) {
                      assert.equal(arrElement, user.name)
                    // Delete the user from the database
                      user.destroy()
                      done()
                    })
      })
    })
  })
})


const path = require('path')
const User = require('../../server/database/models/').User
const assert = require('assert')
const db = require('../../server/database/models/index')

// Extra test frameworks:
// var should = require('should');


/**TEST 1 USER MODEL**/

// Defines alphabet to be used
var s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

// Defines the function to generate the names to be used for the test
// Returns a random String with N length and based on the alphabet s
var testStringGenerator = function (N) {
  return Array(N).join().split(',').map(function () { return s.charAt(Math.floor(Math.random() * s.length)) }).join('')
}

// Unique firstName and lastName for the test
var name = testStringGenerator(10)

// Builds the User object with the corresponding name. Does not save the User objects to the database.
var testUser = User.build({name: name1})

describe('Test suite 1: User model', function () {

    /**
     *  @description Test for database user creation
     */
  describe('Database test for name: ' + name, function () {
    it('Name to User object in database is identical to name generated', function (done) {
      // Access database and create the user if it doesn't exist
      db['User']
        .findOrCreate({
          where: {name:name},
          attributes: ['name']
        })

        // Then compare that user's variables to the variables given
        .spread(function (user, created) {
          assert.equal(name, user.name)
        // Delete the user from the database
          user.destroy()
          done()
        })
    })
  })
})


/**TEST 2 MESSAGE MODEL**/

var testString = testStringGenerator(30)

describe('Test suite 2: Message model', function () {

  /**
   * @description Test for local message
   */
  describe('Database test for message: ' + testString, function () {
    it('Text in Message object in database is identical to testString', function (done) {
      // Access database and create the message if it doesn't exist
      db['Message']
        .findOrCreate({
          where: {text:text},
          attributes: ['text']
        })
        // Then compare that messages's variables to the variables given

        .spread(function (message, created) {
          assert.equal(testString, message.text)
          message.destroy()
          done()
        })
    })
  })
})


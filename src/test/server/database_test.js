const path = require('path')
const User = require('../../server/database/models/').User
const assert = require('assert')
const db = require('../../server/database/models/index')

// Extra test frameworks:
// var should = require('should');

// Defines alphabets to be used
var s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
var n = '0123456789'

// Defines the function to generate the names to be used for the test
// Returns a random String with N length and based on the alphabet s
var testStringGenerator = function (N, s) {
  return Array(N).join().split(',').map(function () { return s.charAt(Math.floor(Math.random() * s.length)) }).join('')
}


/**TEST 1 USER MODEL**/

// Unique firstName and lastName for the test
var name = testStringGenerator(10, s)

describe('Test suite 1: User model', function () {

    /**
     *  @description Test for database user creation
     */
  describe('Database creation for name: ' + name, function () {
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

var testString = testStringGenerator(30, s)

var testTime = "17:04"
var testDate = new Date()
testDate.setHours(17)
testDate.setMinutes(4)
testDate.setSeconds(16)

describe('Test suite 2: Message model', function () {

  /**
   * @description Test for local message
   */
  describe('Database creation for message: ' + testString, function () {
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

  describe('Get formatted time from message model: ' + testTime, function () {
    it('Get function returns string identical to testTime', function (done) {
      db['Message']
        .findOrCreate({
         where: {
           text:testString,
           time:testDate},
         attributes: ['time']
      })
      // Then compare that messages's variables to the variables given

        .spread(function (message, created) {
          assert.equal(testTime, message.get('time'))
          message.destroy()
          done()
        })
    })
  })
})


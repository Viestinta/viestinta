// Hack for pg issues
const path = require('path')
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
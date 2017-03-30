// Hack for pg issues
const path = require('path')
const assert = require('assert')
const db = require('../../server/database/models/index')
const courseController = require('../../server/database/controllers/courses')


/**TEST 1 COURSE MODEL**/

let courseName = "Calculus 1"
let courseCode = "TMA4100"
let courseAdmins = ['jacobot@stud.ntnu.no', 'test']
let testCourse = undefined
describe('Test suite: Course and Lecture testing', function () {

  /**
   *  @description Test for database course creation
   */
  describe('Database creation for name: ' + courseName + ', ' + courseCode, function () {

    it('Name and code to Lecture object in database is identical to input', function (done) {
      // Access database and create the lecture if it doesn't exist
      db['Course']
        .findOrCreate({
          where: {
            name: courseName,
            code: courseCode,
            admins: courseAdmins
          },
        })

        // Then compare that user's variables to the variables given
        .spread(function (course, created) {
          assert.equal(courseName, course.name)
          assert.equal(courseCode, course.code)
          assert.deepEqual(courseAdmins, course.admins)
          // Delete the user from the database
          testCourse = course
          done()
        })

    })
  })

  /**TEST 2 LECTURE MODEL**/

  let lectureName = "Introduction to Integrals"
  let testLecture = undefined
  /**
   *  @description Test for database user creation
   */
  describe('Database creation for lecture: ' + lectureName + ', from ' + courseCode, function () {
    it('Name and code to Lecture object in database is identical to input', function (done) {
      // Access database and create the lecture if it doesn't exist
      db['Lecture']
        .findOrCreate({
          where: {
            name: lectureName,
            CourseId: testCourse.id
          },
        })

        // Then compare that user's variables to the variables given
        .spread(function (lecture, created) {
          assert.equal(lectureName, lecture.name)
          // Delete the user from the database
          testLecture = lecture
          done()
        })
    })
  })

  /**TEST 3 ADD COURSE ADMINS**/


  let pekkaEmail = 'pekka@ntnu.no'
  /**
   *  @description Test for adding admins to course
   */
  describe('Test for adding admins to course: ' + courseAdmins + ', from ' + courseCode, function () {
    it('Admins added are identical to admins in course', function (done) {
      courseController.addUserAsAdmin(pekkaEmail, courseCode, function () {
        courseAdmins.push(pekkaEmail)
        courseController.getAdminsForCourse(courseCode)
          .then(function (databaseAdmins) {
            assert.deepEqual(databaseAdmins.admins, courseAdmins)
            testLecture.destroy().then(function () {
              testCourse.destroy()
            })
            done()
          }).catch(function (err) {
          console.error(err)
        })
      })
    })
  })

  /**TEST 4 DELETE COURSE ADMINS**/

  /**
   *  @description Test for deleting course admins
   */

  let courseName2 = 'Objekt Orientert Programmering'
  let courseCode2 = 'TDT4100'
  let courseAdmins2 = ['hallvard', 'hermann']
  let testCourse2 = undefined

  describe('Test for deleting admins from course: ' + courseAdmins2 + ', from ' + courseCode2, function () {

    before(function (done) {
      courseController.findOrCreateCourse(
        {
          name: courseName2,
          code: courseCode2,
          admins: courseAdmins2
        })
        .spread(function (course, created) {
          testCourse2 = course
          courseController.addUserAsAdmin(pekkaEmail, courseCode2, function () {
            courseAdmins2.push(pekkaEmail)
            done()
          })
        })
    })
    describe('Initialization successful', function () {
      it('Admins deleted are identical to admins in course', function (done) {
        courseController.deleteUserFromAdmins(pekkaEmail, courseCode2, function () {
          courseAdmins2.pop(pekkaEmail)
          courseController.getAdminsForCourse(courseCode2)
            .then(function (databaseAdmins, created) {
              assert.deepEqual(databaseAdmins.admins, courseAdmins2)
              done()
              testCourse2.destroy().then(function () {})

            }).catch(function (err) {
              console.error(err)
          })
        })
      })
    })
  })
})





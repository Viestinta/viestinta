// Hack for pg issues
const path = require('path')
const assert = require('assert')
const db = require('../../server/database/models/index')
const courseController = require('../../server/database/controllers/courses')
const lectureController = require('../../server/database/controllers/lectures')


describe('Test suite: Course and Lecture testing', function () {

  /**TEST 1 CREATE AND DELETE COURSE**/

  let courseName1 = "Calculus 1"
  let courseCode1 = "TMA4100"
  let courseAdmins1 = ['jacobot@stud.ntnu.no', 'test']
  let testCourse1 = undefined

  describe('Create and delete course for: ' + courseName1 + ', ' + courseCode1, function () {

    /**
     *  @description Test for database course creation
     */

    it('Course was created', function (done) {
      // Access database and create the course if it doesn't exist
      courseController.findOrCreateCourse(
        {
          name: courseName1,
          code: courseCode1,
          admins: courseAdmins1
        })
      // Then compare that course's variables to the variables given
        .spread(function (course, created) {
          assert.equal(courseName1, course.name)
          assert.equal(courseCode1, course.code)
          assert.deepEqual(courseAdmins1, course.admins)

          // Continue to use current course as a testCourse
          testCourse1 = course

          //Finish test
          done()
        })
    })

    /**
     *  @description Test for database course deletion
     */

    it('Course was deleted', function (done) {
      // Access database and delete the lecture
      courseController.deleteCourse(courseCode1)
      // Then check if the course exists in database
        .then(function (course) {
          courseController.getByCode(courseCode1).then(function (result) {
            assert.equal(undefined, result)
          })

          //Finish test
          done()

        })
    })
  })

  /**TEST 2 CREATE AND DELETE LECTURE FOR SUBJECT**/

  let courseName2 = "Algoritmer og Datastrukturer"
  let courseCode2 = "TDT4120"
  let courseAdmins2 = ['magnus@hetland.no', 'studass@ntnu.no']
  let lectureName2 = "Introduction to Merge Sort"
  let testCourse2 = undefined
  let testLecture2 = undefined

  describe('Database creation for lecture: ' + lectureName2 + ', from ' + courseCode2,
     function () {

    //Create a course before running the tests
     before(function (done) {

       courseController.findOrCreateCourse(
         {
           name: courseName2,
           code: courseCode2,
           admins: courseAdmins2
         })

         .spread(function (course, created) {
           testCourse2 = course
           done()
         })

         .catch(function (err) {
           console.error(err)
         })
     })


       it('Lecture to ' + courseCode2 + ' was created: ' + lectureName2, function (done) {

         // Access database and create the lecture if it doesn't exist
         lectureController
           .createLecture({
             name: lectureName2,
             CourseId: testCourse2.id
           })

           // Then compare that lecture's variables to the variables given
           .then(function (lecture) {
             assert.equal(lectureName2, lecture.name)

             // Continue to use current lecture as a testLecture
             testLecture2 = lecture

             //Finish test
             done()
           })
       })


       it('Lecture to ' + courseCode2 + ' was deleted: ' + lectureName2, function (done) {

          //Check that the lecture is in the database
         lectureController.getByName(lectureName2)
           .then(function (lecture) {
             // Then check that the testLecture's ID is identical to database
             assert.equal(testLecture2.id, lecture.id)

             // Access database and delete the lecture
             lectureController.deleteLecture(testLecture2)
               .then(function (lecture) {

                 //Try to get the lecture from database
                 lectureController.getByName(lectureName2)
                   .then(function (lecture) {

                     // Then check if the lecture is undefined
                     assert.equal(undefined, lecture)
                   })

                 //Finish test
                 done()

               })
           })
       })
  })


  /**TEST 4 DELETE COURSE ADMINS**/



  let pekkaEmail = 'pekka@ntnu.no'
  let courseName4 = 'Objekt Orientert Programmering'
  let courseCode4 = 'TDT4100'
  let courseAdmins4 = ['hallvard', 'hermann']
  let testCourse4 = undefined

  describe('Test for adding and deleting admins from course: ' + courseCode4, function () {

    before(function (done) {
      courseController.findOrCreateCourse(
        {
          name: courseName4,
          code: courseCode4,
          admins: courseAdmins4
        })
        .spread(function (course, created) {
          testCourse4 = course
          done()
        })
    })


    describe('Initialization successful', function () {

      /**
       *  @description Test for adding admins to course
       */

      it('Admins added are identical to admins in course', function (done) {
        courseController.addUserAsAdmin(pekkaEmail, courseCode4, function () {
          courseAdmins4.push(pekkaEmail)
          courseController.getAdminsForCourse(courseCode4)
            .then(function (databaseAdmins) {
              assert.deepEqual(databaseAdmins.admins, courseAdmins4)
              done()
            }).catch(function (err) {
              console.error(err)
            })
        })
      })

      /**
       *  @description Test for deleting course admins
       */

      it('Admins deleted are removed from admins in the course', function (done) {
        courseController.deleteUserFromAdmins(pekkaEmail, courseCode4, function () {
          courseAdmins4.pop()
          courseController.getAdminsForCourse(courseCode4)
            .then(function (databaseAdmins) {
              assert.deepEqual(databaseAdmins.admins, courseAdmins4)
              done()
              testCourse4.destroy().then(function () {})

            }).catch(function (err) {
              console.error(err)
            })
        })
      })
    })
  })
})





// Hack for pg issues
const path = require('path')
const assert = require('assert')
const db = require('../../server/database/models/index')
const courseController = require('../../server/database/controllers/courses')
const userController = require('../../server/database/controllers/users')
const lectureController = require('../../server/database/controllers/lectures')
const messageController = require('../../server/database/controllers/messages')
const adminRoleController = require('../../server/database/controllers/adminRoles')


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
          //assert.deepEqual(courseAdmins1, course.admins)

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
        .then(function () {
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

     after(function (done) {
       courseController.getByCode(courseCode2).then(function () {
         done()
       })
     })
  })


  /**TEST 4 DELETE COURSE ADMINS**/
  let courseCode4 = 'TDT4100'
  let courseName4 = 'Objekt Orientert Programmering'

  describe('Test for adding and deleting admins from course: ' + courseCode4, function () {

    let testCourse4 = undefined

    let testUser1Name = "Pekka"
    let testUser2Name = "Jacob"
    let testUser1Email = "pekka@stud.ntnu.no"
    let testUser2Email = "jacobot@stud.ntnu.no"

    let testUser1 = undefined
    let testUser2 = undefined

    let testAdminRole1 = undefined
    let testAdminRole2 = undefined

    before(function (done) {

      //Create testUser1
      userController.findOrCreateUser({
        name: testUser1Name,
        email: testUser1Email
      }).spread(function (user, created) {
        testUser1 = user

        //Create testUser2
        userController.findOrCreateUser({
          name: testUser2Name,
          email: testUser2Email
        }).spread(function (user, created) {
          testUser2 = user

          //Create testCourse
          courseController.findOrCreateCourse({
              name: courseName4,
              code: courseCode4,
            })
            .spread(function (course, created) {
              testCourse4 = course

              //Finish setup for test
              done()
            })
        })
      })
    })



    /**
     *  @description Test for adding admins to course
     */

    it('Admins added are identical to admins in course', function (done) {
      adminRoleController.addUserAsAdminToCourse(testUser1, testCourse4)
        .spread(function (adminRole, created) {
          let createdAdminRole = adminRole
          courseController.getAdminsForCourse(testCourse4)
            .then(function (adminRoles) {
              let databaseAdmin = adminRoles[0]
              assert.equal(databaseAdmin.UserId, createdAdminRole.UserId)
              assert.equal(databaseAdmin.CourseId, createdAdminRole.CourseId)

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
      adminRoleController.deleteUserFromAdmins(testUser1, testCourse4, function () {
        courseController.getAdminsForCourse(testCourse4)
        .spread(function (adminRoles, created) {
          assert.equal(adminRoles, undefined)
          done()

        }).catch(function (err) {
          console.error(err)
        })
      })
    })

    after(function (done) {
      courseController.deleteCourse(courseCode4).then(function () {
        userController.deleteUser(testUser1, function () {
          userController.deleteUser(testUser2, function () {
            done()
          })
        })
      })
    })
  })

  /**TEST 5 GET AND UPDATED COURSES**/

  let courseName5 = 'Diskret Matematikk'
  let courseCode5 = 'TMA4140'
  let courseAdmins5 = undefined

  describe('Test for getting a course: ' + courseCode5, function () {
    let testCourse5 = undefined
    //Create a new course for the test before starting the tests
    before(function (done) {

      courseName5 = 'Diskret Matematikk'
      courseCode5 = 'TMA4140'
      courseAdmins5 = ['sigmund', 'gaute']

      courseController.findOrCreateCourse({
        name: courseName5,
        code: courseCode5,
      })
        .then(function (course) {
          testCourse5 = course

          //Finish initialization after creating course
          done()
        })
    })

    /**
     * @description Test for retrieving course from database by courseCode
     */

    it('Course is retrieved from database', function (done) {

      //Get course from database by courseCode
      courseController.getByCode(courseCode5).then(function (course) {
        //Check that the names and admins are correct
        //assert.deepEqual(course.admins, courseAdmins5)
        assert.equal(course.name, courseName5)

        //Finish the test
        done()
      })
    })


    after(function (done) {
      courseController.deleteCourse(courseCode5).then(function () {
        done()
      })
    })
  })

  describe('Test for deleting a course: ' + courseCode5, function () {

    let testCourse5 = undefined
    //Create a new course for the test before starting the tests
    before(function (done) {
      courseName5 = 'Diskret Matematikk'
      courseCode5 = 'TMA4140'
      courseAdmins5 = ['sigmund', 'gaute']

      courseController.findOrCreateCourse({
        name: courseName5,
        code: courseCode5,
      })
        .then(function (course) {
          testCourse5 = course
          //Finish initialization after creating course
          done()
        })
    })

    it('Course from database is updated', function (done) {
      courseController.getByCode(courseCode5).then(function (course) {
        let updates = {name: "Elementær Diskret Matematikk"}
        courseController.updateCourse(course, updates).then(function () {
          courseController.getByCode(courseCode5).then(function (course3) {
            assert.deepEqual(course3.name, updates.name)

            //Finish the test
            done()
          })
        })
      })
    })

    after(function (done) {
      courseController.deleteCourse(courseCode5).then(function () {
        done()
      })
    })
  })

  let courseName6 = 'Matematikk 3'
  let courseCode6 = 'TMA1010'
  let courseAdmins6 = ['me']

  describe('Test for getting all lectures for a course: ' + courseCode6, function () {
    let testCourse6 = undefined
    let testLecture6_1 = undefined
    let testLecture6_2 = undefined

    before(function (done) {
      courseController.findOrCreateCourse({
        name: courseName6,
        code: courseCode6,
      })
        .spread(function (course, created) {
          testCourse6 = course
          lectureController.createLecture({
            name: 'Turing Machines',
            CourseId: testCourse6.id
          })

            .then(function (lecture, created) {
              testLecture6_1 = lecture
              lectureController.createLecture({
                name: 'Turing Machines Part 2',
                CourseId: testCourse6.id
              }).then(function (lecture) {
                testLecture6_2 = lecture
                done()
              })
          })
        })
    })

    it('Lectures are retrieved successfully', function (done) {

      courseController.getAllLecturesForCourse(courseCode6, function (lectures) {

        let lecture1 = lectures[0]
        let lecture2 = lectures[1]

        if (lecture1.name === testLecture6_1.name){
          //assert.equal(lecture1.admins, testLecture6_1.admins)
          assert.equal(lecture2.name, testLecture6_2.name)
        } else {
          //assert.equal(lecture2.admins, testLecture6_1.admins)
          assert.equal(lecture1.name, testLecture6_2.name)
        }

        done()
      })

    })

    after(function (done) {
      testLecture6_1.destroy().then(function () {
        testLecture6_2.destroy().then(function () {
          testCourse6.destroy().then(function () {
            done()
          })
        })
      })
    })
  })

  let courseName7 = "Data GK"
  let courseCode7 = "TDT2048"
  let courseAdmins7 = ['me']

  let lectureName7 = "Introduction to ALUs"


  describe('Test for getting lectures and updating:  ' + courseCode7, function () {
    let testLecture7 = undefined
    let testCourse7 = undefined

    before(function (done) {
      courseController.findOrCreateCourse({
        name: courseName7,
        code: courseCode7,
        admins: courseAdmins7
      }).spread(function (course, then) {

        testCourse7 = course

        lectureController.createLecture({
          CourseId: course.id,
          name: lectureName7
        }).then(function (lecture) {

          testLecture7 = lecture
          done()
        })

      })
    })


    it('Got lecture by name', function (done) {
      lectureController.getByName(lectureName7).then(function (lecture) {
        assert.equal(lecture.id, testLecture7.id)
        done()
      })
    })

    it('Got lecture by ID', function (done) {
      lectureController.getById(testLecture7.id).then(function (lecture) {
        assert.equal(lecture.name, testLecture7.name)
        done()
      })

    })

    it('Got all lectures', function (done) {
      lectureController.createLecture({
        name: "TestLecture For Got all lecture",
        CourseId: testCourse7.id
      }).then(function (lecture) {
        let testLecture = lecture
        lectureController.getAll().then(function (lectures) {
          //assert.equal(lectures[lectures.length-1].id, testLecture.id)
          //TODO: Need to find a better way to test this
          testLecture.destroy().then(function () {
            done()
          })
        })
      })

    })

    it('Updated a lecture', function (done) {
      let updates = {name: "Introduction to CPUs"}
      lectureController.updateLecture(testLecture7, updates).then(function () {
        lectureController.getById(testLecture7.id).then(function (lectureID) {
          lectureController.getByName(updates.name).then(function (lectureName) {
            assert.equal(lectureID.name, lectureName.name)
            done()
          })
        })
      })
    })

    after(function (done) {
      testLecture7.destroy().then(function () {
        courseController.deleteCourse(courseCode7).then(function () {
          done()
        })
      })
    })
  })


  let courseName8 = "Database"
  let courseCode8 = "TDT4145"
  let courseAdmins8 = ['postgres', 'sql']
  let lectureName8 = "Datamodellering"

  describe('Test for getting all messages for a lecture', function () {


    let testCourse8 = undefined
    let testLecture8 = undefined
    let message0 = undefined
    let message1 = undefined

    before(function (done) {
      courseController.findOrCreateCourse({
        name: courseName8,
        code: courseCode8,
        admins: courseAdmins8
      }).spread(function(course, created){
        testCourse8 = course
        lectureController.createLecture({
          name: lectureName8,
          CourseId: testCourse8.id
        }).then(function (lecture) {
          testLecture8 = lecture
          messageController.createMessage({
            text: "Kjempe kult med Databaser!",
            LectureId: testLecture8.id
          }).then(function (message) {
            message0 = message
            messageController.createMessage({
              text: "Ja, ikke sant?",
              LectureId: testLecture8.id
            }).then(function (message) {
              message1 = message
              done()
            })
          })
        })
      })
    })

    it('Messages are identical to test input', function (done) {
      lectureController.getAllMessages(testLecture8).then(function (messages) {

        let testMessage0 = messages[0]
        let testMessage1 = messages[1]

        if(testMessage0.text === message0.text){
          assert.equal(testMessage0.text, message0.text)
          assert.equal(testMessage0.id, message0.id)
          assert.equal(testMessage1.text, message1.text)

          done()

        } else {
          assert.equal(testMessage0.text, message1.text)
          assert.equal(testMessage0.id, message1.id)
          assert.equal(testMessage1.text, message0.text)

          done()
        }
      })
    })

    after(function (done) {
      message1.destroy().then(function () {
        message0.destroy().then(function () {
          testLecture8.destroy().then(function () {
            testCourse8.destroy().then(function () {
              done()
            })
          })
        })
      })
    })
  })

  describe('Test for getting all users to a course', function () {

    let testCourse9 = undefined
    let testUser9 = undefined

    before(function (done) {
      courseController.findOrCreateCourse({
        name: "TestCourse",
        code: "TDT0400"
      }).spread(function (course, created) {
        testCourse9 = course
        userController.findOrCreateUser({
          name: "Jacob2"
        }).spread(function (user, created) {
          testUser9 = user
          testUser9.addCourse(testCourse9).then(function () {
            done()
          })
        })
      })
    })

    it('Getting all users from course', function (done) {
      courseController.getAllUsersForCourse(testCourse9).spread(function(user, created){
        //assert.equal(testUser9.id, user.id)
        assert.equal(testUser9.name, user.name)
        done()
      })
    })

    after(function (done) {
      testUser9.destroy().then(function () {
        testCourse9.destroy().then(function () {
          done()
        })
      })
    })
  })
})





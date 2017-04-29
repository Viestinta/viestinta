const assert = require('assert')
const adminRoleController = require('../../server/database/controllers/adminRoles')
const courseController = require('../../server/database/controllers/courses')
const lectureController = require('../../server/database/controllers/lectures')
const userController = require('../../server/database/controllers/users')

describe('Testing adminRoles', function () {

  let testCourse
  let testLecture
  let testUser

  before(function (done) { // eslint-disable-line
    courseController.findOrCreateCourse({
      name: 'TestCourseForUser',
      code: 'TEST1155'
    }).spread(function (course, created) {
      testCourse = course
      lectureController.createLecture({
        name: 'TestLectureForUser',
        CourseId: testCourse.id
      }).then(function (lecture) {
        testLecture = lecture
        userController.findOrCreateUser({
          name: 'TestErik',
          email: 'TestErik@berg.no',
        }).spread(function (user, created) {
          testUser = user
          done()
        })
      })
    })
  })

  it('Update user', function (done) {
    userController.updateUser(testUser, {name: 'TestJacob', email: 'TestJacob@torring.no'}).then(function (user) {
      assert.equal(user.name, testUser.name)
      assert.equal(user.name, 'TestJacob')
      done()
    })
  })

  it('Get by name', function (done) {
    userController.getByName('TestJacob').then(function (user) {
      assert.equal(user.id, testUser.id)
      assert.equal(user.name, testUser.name)
      assert.equal(user.name, 'TestJacob')
      done()
    })
  })

  it('Add and get all lecture for user', function (done) {
    userController.addUserToLecture(testUser, testLecture).then(function () {
      userController.getAllLectureForUser(testUser).then(function (lectures) {
        assert.equal(lectures[0].name, testLecture.name)
        assert.equal(testLecture.name, 'TestLectureForUser')
        done()
      })
    })
  })

  it('Add and get all courses for user', function (done) {
    userController.addUserToCourse(testUser, testCourse).then(function () {
      userController.getAllCourseForUser(testUser).then(function (courses) {
        assert.equal(courses[0].name, testCourse.name)
        assert.equal(courses[0].code, 'TEST1155')
        done()
      })
    })
  })

  it('Add user to adminRole and delete the user', function (done) {
    adminRoleController.addUserAsAdminToCourse(testUser, testCourse).then(function () {
      userController.deleteUser(testUser, function () {
        userController.getByName('TestJacob').then(function (user) {
          assert.equal(user, undefined)
          done()
        })
      })
    })
  })

  after(function (done) { // eslint-disable-line
    testLecture.destroy().then(function () {
      testCourse.destroy().then(function () {
        done()
      })
    })
  })
})
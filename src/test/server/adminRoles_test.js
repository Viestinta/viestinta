const assert = require('assert')
const adminRoleController = require('../../server/database/controllers/adminRoles')
const courseController = require('../../server/database/controllers/courses')
const userController = require('../../server/database/controllers/users')

describe('Testing adminRoles', function () {
  let testUserName = 'CreateAdminRoleUser'
  let testUser
  let testCourseName = 'CreateAdminRoleCourseName'
  let testCourseCode = 'TDT4040'
  let testCourse
  let testAdminRole
  before(function (done) { // eslint-disable-line
    userController.findOrCreateUser({
      name: testUserName
    }).spread(function (user, created) {
      testUser = user
      courseController.findOrCreateCourse({
        name: testCourseName,
        code: testCourseCode
      }).spread(function (course, created) {
        testCourse = course
        adminRoleController.addUserAsAdminToCourse(testUser, testCourse, 'Foreleser')
          .then(function (adminRole) {
            testAdminRole = adminRole
            done()
          })
      })
    })
  })
  it('Create adminRole', function (done) {
    adminRoleController.getAllByUserId(testUser.id)
      .then(function (adminRoles) {
        testAdminRole = adminRoles[0]
        assert.equal(adminRoles[0].roleType, 'Foreleser')
        done()
      })
  })
  it('Update adminRoleType', function (done) {
    assert.equal(testAdminRole.roleType, 'Foreleser')
    adminRoleController.updateAdminRoleType(testAdminRole, 'Undass').then(function () {
      assert.equal(testAdminRole.roleType, 'Undass')
      done()
    })
  })
  it('Deactivate adminRole', function (done) {
    assert.equal(testAdminRole.active, true)
    adminRoleController.deactivateAdminRole(testAdminRole).then(function () {
      adminRoleController.getAllByUserId(testUser.id).then(function (adminRoles) {
        assert.equal(adminRoles[0].active, false)
        done()
      })
    })
  })
  it('Active adminRole', function (done) {
    assert.equal(testAdminRole.active, false)
    adminRoleController.activateAdminRole(testAdminRole).then(function () {
      adminRoleController.getAllByUserId(testUser.id).then(function (adminRoles) {
        assert.equal(adminRoles[0].active, true)
        done()
      })
    })
  })
  it('Get all by CourseId', function (done) {
    adminRoleController.getAllByCourseId(testCourse.id).then(function (adminRoles) {
      assert.equal(testAdminRole.id, adminRoles[0].id)
      done()
    })
  })

  after(function (done) { // eslint-disable-line
    testUser.destroy().then(function () {
      testCourse.destroy().then(function () {
        adminRoleController.deleteAllAdminRoles().then(function () {
          done()
        })
      })
    })
  })
})

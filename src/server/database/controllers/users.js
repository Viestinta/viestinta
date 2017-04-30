/**
 * Created by jacob on 20.02.17.
 */

// Controller for user model
const User = require('../models/index').User
const adminRoleController = require('../controllers/adminRoles')

/**
 * @description Creates and returns a Promise for that user
 * @param user
 * @returns {Promise.<User, created>}
 */
let findOrCreateUser = function (user) {
  return User.findOrCreate({
    where: {
      name: user.name,
      email: user.email
    }
  })
}

/**
 * @description Gets a user by UserId and returns a Promise for that user
 * @param UserId
 * @returns {Promise.<User>}
 */
let getById = function (UserId) {
  return User.find({
    where: {
      id: UserId
    }
  })
}

/**
 * @description Gets a user by name and returns a Promise for that user
 * @param name
 * @returns {Promise.<User>}
 */
let getByName = function (name) {
  return User.find({
    where: {
      name: name
    }
  })
}

/**
 * @description Gets user by email and returns a Promise for that user
 * @param email
 * @returns {Promise.<User>}
 */
let getByEmail = function (email) {
  return User.find({
    where: {
      email: email
    }
  })
}

/**
 * @description Edits an existing user's details using model.update()
 * @param user
 * @param updates
 * @returns {Promise.<User>}
 */
let updateUser = function (user, updates) {
  return user.update(updates)
}

/**
 * @description Gets all users
 * @returns {Promise.<Array.<User>>}
 */
let getAllUsers = function () {
  return User.findAll()
}

/**
 * @description Gets all lectures related to the user
 * @param user
 * @returns {Promise.<Array.<Lecture>>}
 */
let getAllLectureForUser = function (user) {
  return user.getLectures()
}

/**
 * @description Gets all lectures related to the user
 * @param user
 * @returns {Promise.<Array.<Course>>}
 */
let getAllCourseForUser = function (user) {
  return user.getCourses()
}

/**
 * @description Adds user to a lecture
 * @param user
 * @param lecture
 * @returns {Promise}
 */
let addUserToLecture = function (user, lecture) {
  return user.addLecture(lecture)
}

/**
 * @description Adds user to a course
 * @param user
 * @param course
 * @returns {Promise}
 */
let addUserToCourse = function (user, course) {
  return user.addCourse(course)
}

/**
 * @description Deletes an existing user by their unique ID
 * @description and their respective adminRoles
 * @param user
 * @param callback
 * @callback Callbacks when all adminRoles and the user has been deleted
 */
let deleteUser = function (user, callback) {
  adminRoleController.getAllByUserId(user.id)
    .spread(function (adminRoles, created) {
      if (adminRoles) {
        adminRoleController.deleteAllAdminRoles(adminRoles)
          .then(function () {
            User.destroy({
              where: {
                id: user.id
              }
            }).then(function () {
              if (callback) {
                callback()
              }
            })
          })
      } else {
        User.destroy({
          where: {
            id: user.id
          }
        }).then(function () {
          if (callback) {
            callback()
          }
        })
      }
    })
}

module.exports = {
  findOrCreateUser: findOrCreateUser,
  getById: getById,
  getByName: getByName,
  getByEmail: getByEmail,
  getAllUsers: getAllUsers,
  getAllLectureForUser: getAllLectureForUser,
  getAllCourseForUser: getAllCourseForUser,
  addUserToCourse: addUserToCourse,
  addUserToLecture: addUserToLecture,
  updateUser: updateUser,
  deleteUser: deleteUser,
}

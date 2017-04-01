const Course = require('../models/index').Course
const Lecture = require('../models/index').Lecture
const AdminRole = require('../models/index').AdminRole
// Controller for course model

/**
 * @description Creates and returns a Promise for a course
 * @param course
 * @returns {Promise.<Course>}
 * @tutorial Use .spread(course, created)
 */
let findOrCreateCourse = function (course) {
  return Course.findOrCreate({
    where: {
      name: course.name,
      code: course.code,
    },
  })
}



/**
 * @description Returns course by code and returns a Promise for that course
 * @param code
 * @returns {Promise.<Course>}
 */
let getByCode = function (code) {
  return Course.find({
    where: {
      code: code
    }
  })
}



/**
 * @description Returns all admins for course
 * @param course
 * @returns {Promise.<AdminRole>}
 */
let getAdminsForCourse = function (course) {
  return AdminRole.findAll({
    where: {
      CourseId: course.id
    },
  })
}



/**
 * @description Returns all lectures to the course specified by the courseCode
 * @param courseCode
 * @param callback
 * @returns {Promise.<Lecture>}
 * @callback callback
 */
let getAllLecturesForCourse = function (courseCode, callback) {
  getByCode(courseCode).then(function (course) {
    Lecture.findAll({
      where: {
        CourseId: course.id
      }
    }).then(function(lectures){
      callback(lectures)
    })
  })
}



/**
 * @description Updates an existing course's details using model.update()
 * @param course
 * @param updates
 * @returns {Promise.<Course>}
 */

let updateCourse = function(course, updates) {
  return course.update(updates)
}



/**
 * @description Deletes an existing course by their unique ID using model.destroy()
 * @param courseCode
 * @returns {Promise.<Course>}
 */
let deleteCourse=function(courseCode) {
  return Course.destroy({
    where: {
      code: courseCode
    }
  })
}



module.exports = {
  findOrCreateCourse:       findOrCreateCourse,
  getByCode:                getByCode,
  getAdminsForCourse:       getAdminsForCourse,
  getAllLecturesForCourse:  getAllLecturesForCourse,
  updateCourse:             updateCourse,
  deleteCourse:             deleteCourse,

}

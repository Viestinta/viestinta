const Course = require('../models/index').Course
const Lecture = require('../models/index').Lecture
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
      admins: course.admins,
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
 * @description Returns the list of admins for a course
 * @param courseCode
 * @returns {Promise.<Course>}
 */
let getAdminsForCourse = function (courseCode) {
  return Course.find({
    where: {
      code: courseCode
    },
    attributes: ['admins']
  })


}



/**
 * @description Adds a userEmail to the course's adminList, given by the courseCode
 * @param userEmail
 * @param courseCode
 * @param callback
 *
 */
let addUserAsAdmin = function (userEmail, courseCode, callback){
  getByCode(courseCode)
    .then(function (course) {
      let adminList = course.admins

      //Only adds userEmail to adminList if it doesn't already exist
      if (adminList.indexOf(userEmail) === -1) {
        adminList.push(userEmail)
      } else {
        console.log("This user is already an admin in this course", adminList)
      }

      //Saves the course with potentially new adminList
      course.update({
        admins: adminList
      }).then(function () {
        //Calls the callback argument, which is executed after updating the database
        if (callback){
          callback()
        }
      })

      //Catches any errors that may have occurred
    }).catch(function (err) {
      console.error(err)
    })
}



/**
 * @description Deletes a userEmail from the course's adminList, given by the courseCode
 * @param userEmail
 * @param courseCode
 * @param callback
 * @callback Runs callback after deleting user from admins
 */
let deleteUserFromAdmins = function (userEmail, courseCode, callback){
  getByCode(courseCode)
    .then(function (course) {
      let adminList = course.admins

      //Only adds userEmail to adminList if it doesn't already exist

      let index = adminList.indexOf(userEmail)
      if (index > -1) {
        adminList.splice(index, 1)
      }else{
        console.log("This user is not an admin in this course", adminList)
      }

      //Saves the course with potentially new adminList
      course.update({
        admins: adminList
      }).then(function () {

        //Callback: run the code in the callback argument
        if (callback){
          callback()
        }
      })

      //Catches any errors that may have occurred
    }).catch(function (err) {
      console.error(err)
    })

  //TODO: Make a return statement for conditional routing?
}



/**
 * @description Returns all lectures to the course specified by the courseCode
 * @param courseCode
 * @returns {Promise.<Lecture>}
 */
let getAllLecturesForCourse = function (courseCode) {
  getByCode(courseCode).then(function (course) {
    return Lecture.findAll({
              where: {
                CourseId: course.id
              }
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
  addUserAsAdmin:           addUserAsAdmin,
  deleteUserFromAdmins:     deleteUserFromAdmins,
  getAllLecturesForCourse:  getAllLecturesForCourse,
  updateCourse:             updateCourse,
  deleteCourse:             deleteCourse,

}

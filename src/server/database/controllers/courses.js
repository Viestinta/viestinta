const Course = require('../models/index').Course
const Lecture = require('../models/index').Lecture
// Controller for course model

/**
 * @description Creates and returns a Promise for a course
 * @param req
 * @returns {Promise.<Course>}
 */
let createCourse = function () {
  return Course.create({
    name: req.name,
    code: req.code,
    admins: req.admins,
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
        console.log("This user is already an admin in this course")
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
 *
 */
let deleteUserFromAdmins = function (userEmail, courseCode){
  getByCode(courseCode)
    .then(function (course) {
      let adminList = course.admins

      //Only adds userEmail to adminList if it doesn't already exist

      let index = adminList.indexOf(userEmail)
      if (index > -1) {
        adminList.splice(index, 1)
      }else{
        console.log("This user is not an admin in this course")
      }

      //Saves the course with potentially new adminList
      course.save().then(function () {})

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
 * @param req
 */

let updateCourse = function(req) {
  Course.update(req.body, {
    where: {
      id: req.params.id
    }
  })
}



/**
 * @description Deletes an existing course by their unique ID using model.destroy()
 * @param req
 * @param res
 */
let deleteCourse=function(req, res) {
  Course.destroy({
    where: {
      id: req.params.id
    }
  })
}

module.exports = {
  createCourse:             createCourse,
  getByCode:                getByCode,
  getAdminsForCourse:       getAdminsForCourse,
  addUserAsAdmin:           addUserAsAdmin,
  deleteUserFromAdmins:     deleteUserFromAdmins,
  getAllLecturesForCourse:  getAllLecturesForCourse,
  updateCourse:             updateCourse,
  deleteCourse:             deleteCourse,

}

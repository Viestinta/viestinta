// Controller for Lecture model

var Lecture = require('../models/index').Lecture
var Message = require('../models/index').Message
var User = require('../models/index').User

let courseController = require('../controllers/index').courses


/**
 * @description Create a new Lecture using model.create()
 * @param lecture
 * @returns {Promise.<Lecture>}
 */
let createLecture = function(lecture) {
  return Lecture.create({
    name: lecture.name,
    CourseId: lecture.CourseId,
    startDate: lecture.startDate,
    endDate: lecture.endDate,
    location: lecture.loc,
    description: lecture.description,
  })
}



/**
 * @description Edit an existing Lecture details using model.update()
 * @param lecture
 * @param updates
 * @returns {Promise.<Lecture>}
 */
let updateLecture = function(lecture, updates) {
  return lecture.update(updates)
}



/**
 * @description Delete an existing Lecture by the unique ID using model.destroy()
 * @param lecture
 * @returns {Promise.<Lecture>}
 */
let deleteLecture = function(lecture) {
  return Lecture.destroy({
    where: {
      id: lecture.id
    }
  })
}



/**
 * @description Get all lectures
 * @returns {Promise.<Lecture>}
 */
let getAll = function() {
  return Lecture.findAll()
}



/**
 * @description Retrive an existing Lecture by the unique ID
 * @param id
 * @returns {Promise.<Lecture>}
 */
let getById = function(id) {
  return Lecture
    .find({
        where: {
          id: id
        }
      })
}



/**
 * @description Returns Lecture matching parameter name
 * @param name
 * @returns {Promise.<Lecture>}
 */
let getByName = function(name) {
  return Lecture.find({
    where: {
      name: name
    }
  })
}



/**
 * @description Returns all messages in lecture
 * @param lecture
 * @returns {Promise.<Lecture>}
 */
let getAllMessages = function(lecture) {
  return Message.findAll({
    where: {
      LectureId: lecture.id
    },
  })
}



/**
 * @description Returns all users related to a lecture
 * @param lecture
 * @returns {Promise.<Array<User>>}
 */

let getAllUsers = function (lecture) {
  return User.findAll({
    where: {
      LectureId: lecture.id
    }
  })
}



/**
 * @description Gets the CourseId from the lecture
 * @param lecture
 * @returns Integer
 */
let getCourse = function (lecture) {
  return lecture.CourseId
}



/**
 * @description Gets admins for the lecture's course
 * @param lecture
 * @returns {Promise.<Course>}
 * @deprecated TODO: Needs update
 */
let getAdmins = function (lecture) {
  return courseController.getAdminsForCourse(lecture.CourseId)

}



module.exports = {
  createLecture:        createLecture,
  updateLecture:        updateLecture,
  deleteLecture:        deleteLecture,
  getAll:               getAll,
  getById:              getById,
  getByName:            getByName,
  getAllMessages:       getAllMessages,
  getAllUsers:          getAllUsers,
  getCourse:            getCourse,
  getAdmins:            getAdmins
}



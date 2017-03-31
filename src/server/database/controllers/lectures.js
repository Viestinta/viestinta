// Controller for Lecture model

var Lecture = require('../models/index').Lecture
var Message = require('../models/index').Message



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
 * @returns {Promise.<Lecture>}
 */
let updateLecture = function(lecture) {
  return Lecture.update(lecture, {
    where: {
      id: lecture.id
    }
  })
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
    /*include: [
    {
      model: Message, as: 'messages'
    }]*/
  })
}

module.exports = {
  createLecture:        createLecture,
  updateLecture:        updateLecture,
  deleteLecture:        deleteLecture,
  getAll:               getAll,
  getById:              getById,
  getByName:            getByName,
  getAllMessages:       getAllMessages,

}



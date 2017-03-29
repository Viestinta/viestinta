// Controller for Lecture model

var Lecture = require('../models/index').Lecture
var Message = require('../models/index').Message


  /**
   * @description Create a new Lecture using model.create()
   * @param req
   * @returns {Promise.<Lecture>}
   */
  create (req) {
    return Lecture.create({
      CourseId: req.courseId,
      startDate: new Date(req.startDate),
      endDate: new Date(req.endDate),
      location: req.loc,
      description: req.description,
    })
  },



  /**
   * @description Edit an existing Lecture details using model.update()
   * @param req
   * @returns {Promise.<Lecture>}
   */
  update (req) {
    return Lecture.update(req.body, {
      where: {
        id: req.params.id
      }
    })
  },



  /**
   * @description Delete an existing Lecture by the unique ID using model.destroy()
   * @param req
   * @returns {Promise.<Lecture>}
   */
  delete (req) {
    return Lecture.destroy({
      where: {
        id: req.params.id
      }
    })
  },



  /**
   * @description Get all lectures
   * @returns {Promise.<Lecture>}
   */
  getAll () {
    return Lecture.findAll()
  },



  /**
   * @description Retrive an existing Lecture by the unique ID
   * @param req
   * @param res
   * @returns {Promise.<Lecture>}
   */
  retrieve (req, res) {
    return Lecture
      .findById(req.params.id, {
        include: [{
          model: Lecture,
          as: 'lecture'
        }]
      })
      .then(lecture => {
        if (!lecture) {
          return res.status(404).send({
            message: 'Lecture Not Found'
          })
        }
      })
      .catch(error => res.status(400).send(error))
  },



  /**
   * @description Returns Lecture matching parameter name
   * @param name
   * @returns {Promise.<Lecture>}
   */
  retrieveByName (name) {
    return Lecture.find({
      where: {
        name: name
      }
    })
  },



  /**
   * @description Returns all messages in lecture
   * @param lecture
   * @returns {Promise.<Lecture>}
   */
  getAllMessages (lecture) {
    return Lecture.findAll({
      where: {
        id: lecture.id
      },
      include: [
      {
        model: Message, as: 'messages'
      }]
    })
  },


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
  return Lecture.findAll({
    where: {
      id: lecture.id
    },
    include: [
    {
      model: Message, as: 'messages'
    }]
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



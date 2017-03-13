// Controller for Lecture model

var Lecture = require('../models/index').Lecture
var Message = require('../models/index').Message

module.exports = {

  /**
   * @description Create a new Lecture using model.create()
   * @param req
   */
  create (req) {
    return Lecture.create({
      startDate: new Date(req.startDate),
      endDate: new Date(req.endDate),
      location: req.loc,
      description: req.description
    })
  },

  /**
   * @description Edit an existing Lecture details using model.update()
   * @param req
   * @returns {*|Progress|Promise.<Array.<affectedCount, affectedRows>>|ReactWrapper|ShallowWrapper}
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
   * @returns {*}
   */
  getAll () {
    return Lecture.findAll()
  },

  /**
   * @description Retrive an existing Lecture by the unique ID
   * @param req
   * @param res
   * @returns {Promise.<T>}
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
        return res.status(200).send(lecture)
      })
      .catch(error => res.status(400).send(error))
  },

  retriveByName (name) {
    return Lecture.find({
      where: {
        name: name
      }
    })
  },

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
  }
}

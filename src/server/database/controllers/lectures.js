// Controller for Message model

var Lecture = require('../models/index').Lecture

module.exports = {

  // Create a new Message using model.create()
  create (req) {
    return Lecture.create({
      time: new Date(),
      text: req.text
    })
  },

  // Edit an existing Message details using model.update()
  update (req) {
    return Lecture.update(req.body, {
      where: {
        id: req.params.id
      }
    })
  },

  // Delete an existing Message by the unique ID using model.destroy()
  delete (req, res) {
    return Lecture.destroy({
      where: {
        id: req.params.id
      }
    })
  },

  // Get last 10
  getAll (req) {
    return Lecture.all({})
  },

  // Retrive an existing Message by the unique ID
  retrieve (req, res) {
    return Lecture
      .findById(req.params.messageId, {
        include: [{
          model: Lecture,
          as: 'lecture'
        }]
      })
      .then(message => {
        if (!message) {
          return res.status(404).send({
            message: 'Message Not Found'
          })
        }
        return res.status(200).send(message)
      })
      .catch(error => res.status(400).send(error))
  }
}

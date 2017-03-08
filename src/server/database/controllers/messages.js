// Controller for Message model

var Message = require('../models/index').Message

module.exports = {

  // Create a new Message using model.create()
  create (req) {
    return Message.create({
      time: new Date(),
      text: req.text
    })
  },

  // Edit an existing Message details using model.update()
  update (req) {
    return Message.update(req.body, {
      where: {
        id: req.params.id
      }
    })
  },

  // Delete an existing Message by the unique ID using model.destroy()
  delete (req, res) {
    return Message.destroy({
      where: {
        id: req.params.id
      }
    })
  },

  // Get last 10
  getLastTen (req) {
    return Message.all({
      order: '"createdAt" DESC',
      limit: 2
    })
  },

  // Retrive an existing Message by the unique ID
  retrieve (req, res) {
    return Message
      .findById(req.params.messageId, {
        include: [{
          model: Message,
          as: 'message'
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

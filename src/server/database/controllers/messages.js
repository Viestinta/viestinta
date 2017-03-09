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
  delete (req) {
    Message.destroy({
      where: {
        id: req.params.id
      }
    })
  },

  // Get last 10
  getLastTen (req) {
    return Message.all({
      order: '"time" DESC',
      limit: 10
    })
  },

  // Retrive an existing Message by the unique ID
  retrieve (req) {
    return Message
      .findById(req.params.messageId, {
        include: [{
          model: Message,
          as: 'message'
        }]
      })
  }
}

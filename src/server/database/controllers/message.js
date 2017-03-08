const Message = require('../models/index').Message
// Controller for Message model

module.exports = {

    // Create a new Message using model.create()

  create (req, res) {
    return Message.create({
      time: new Date().now(),
      text: req.body.text
      console.log("Creating new message-object")
    })
        .then(function (newMessage) {
          res.status(200).json(newMessage)
        })
        .catch(function (error) {
          res.status(500).json(error)
        })
  },

    // Edit an existing Message details using model.update()
  update (req, res) {
    return Message.update(req.body, {
      where: {
        id: req.params.id
      }
    })
            .then(function (updatedRecords) {
              res.status(200).json(updatedRecords)
            })
            .catch(function (error) {
              res.status(500).json(error)
            })
  },

    // Delete an existing Message by the unique ID using model.destroy()
  delete (req, res) {
    return Message.destroy({
      where: {
        id: req.params.id
      }
    })
            .then(function (deletedRecords) {
              res.status(200).json(deletedRecords)
            })
            .catch(function (error) {
              res.status(500).json(error)
            })
  },

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

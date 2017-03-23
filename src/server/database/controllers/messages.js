// Controller for Message model

const Message = require('../models/index').Message
const Lecture = require('../models/index').Lecture

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
        id: req.id
      }
    })
  },

  // Delete an existing Message by the unique ID using model.destroy()
  delete (req) {
    Message.destroy({
      where: {
        id: req.id
      }
    })
  },

  // Get last 10
  getLastTen (lecture) {
    return Message.findAll({
      where: {
        LectureId: lecture.id
      },
      order: '"time" DESC',
      limit: 10
    })
  },

  // Get all to a specific lecture
  getAllToLecture (lecture) {
    return Message.findAll({
      where: {
        LectureId: lecture.id
      }
    })
  },

  // Retrive an existing Message by the unique ID
  retrieve (req) {
    return Message
      .findById(req.params.MessageId, {
        include: [{
          model: Message,
          as: 'message'
        }]
      })
  },

  vote (req) {
    var msg = Message.findById(req.id).then(function (result) {
      if (req.value === -1) {
        msg.votesDown ++
      } else {
        msg.votesUp ++
      }
    })
  }
}

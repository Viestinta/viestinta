// Controller for Message model

const Message = require('../models/index').Message
// const Lecture = require('../models/index').Lecture

module.exports = {

  /**
   * @description Create a new Message using model.create()
   * @param message
   * @returns {Promise.<Message>}
   */
  createMessage (message) {
    return Message.create({
      time: message.time,
      text: message.text,
      LectureId: message.LectureId,
      UserId: message.UserId
    })
  },

  /**
   * @description Edit an existing Message details using model.update()
   * @param message
   * @param updates
   * @returns {Promise.<Message>}
   */
  updateMessage (message, updates) {
    return message.update(updates)
  },

  /**
   * @description Delete an existing Message by the unique ID using model.destroy()
   * @param message
   * @returns {Promise}
   */
  deleteMessage (message) {
    return message.destroy()
  },

  /**
   * Get last 10 messages in lecture
   * @param lecture
   * @returns {Promise.<Message>}
   */
  getLastTen (lecture) {
    return Message.findAll({
      where: {
        LectureId: lecture.id
      },
      order: '"time" DESC',
      limit: 10
    })
  },

  /**
   * @description Get all to a specific lecture
   * @param lecture
   * @returns {Promise.<Message>}
   */
  getAllToLecture (lecture) {
    return Message.findAll({
      where: {
        LectureId: lecture.id
      },
      raw: true,
      order: '"time" DESC'
    })
  },

  /**
   * @descriptio Gets all to a specific user
   * @param user
   * @returns {Promise.<Message>}
   */
  getAllToUser (user) {
    return Message.findAll({
      where: {
        UserId: user.id
      }
    })
  },

  /**
   * @description Gets all messages containing the given text
   * @param text
   * @returns {Promise.<Array.<Message>>}
   */
  getAllByText (text) {
    return Message.findAll({
      where: {
        text: text
      }
    })
  },

  /**
   * @description Get all
   * @returns {Promise.<Message>}
   */
  getAll () {
    return Message.findAll({
      raw: true,
      order: '"time" DESC'
    })
  },

  getById (req) {
    return Message.findById(req.id)
  },

/**
   * @description Changes voting attributes in message
   * @param req
   * @param callback
   * @callback Callbacks when voting attributes have been updated
   */
  vote (req, callback) {
    Message.find({where: {id: req.id}})
      .then(function (msg) {
        if (req.value === 1) {
          msg.increment('votesUp', {
            where: {id: req.id}
          }).then(function () {
            if (callback) {
              callback()
            }
          })
        } else if (req.value === -1) {
          msg.increment('votesDown', {
            where: {id: req.id}
          }).then(function () {
            if (callback) {
              callback()
            }
          })
        }
      })
  }
}

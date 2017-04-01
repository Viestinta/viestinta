// Controller for Message model

const Message = require('../models/index').Message
const Lecture = require('../models/index').Lecture

module.exports = {

  /**
   * @description Create a new Message using model.create()
   * @param req
   * @returns {Promise.<Message>}
   */
  create (req) {
    return Message.create({
      time: new Date(),
      text: req.text
    })
  },



  /**
   * @description Edit an existing Message details using model.update()
   * @param req
   * @returns {Promise.<Message>}
   */
  update (req) {
    return Message.update(req.body, {
      where: {
        id: req.id
      }
    })
  },



  /**
   * @description Delete an existing Message by the unique ID using model.destroy()
   * @param req
   */
  delete (req) {
    Message.destroy({
      where: {
        id: req.id
      }
    })
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
      }
    })
  },



  /**
   * @description Retrieve an existing Message by the unique ID
   * @param req
   * @returns {Promise.<Message>}
   */
  retrieve (req) {
    return Message
      .findById(req.params.MessageId, {
        include: [{
          model: Message,
          as: 'message'
        }]
      })
  },



  /**
   * @description
   * @param req
   */
  vote (req) {
    return Message.findById(req.id).then(function (msg) {
      if (req.value === -1) {
        msg.votesDown ++
      } else {
        msg.votesUp ++
      }
    })
  }

}

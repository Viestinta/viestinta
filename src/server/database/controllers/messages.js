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
   * @param message
   * @param updates
   * @returns {Promise.<Message>}
   */
  update (message, updates) {
    return Message.update(message, updates}
    })
  },



  /**
   * @description Delete an existing Message
   * @param message
   * @returns {Promise.<Message>}
   */
  delete (message) {
    message.destroy()
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
        LectureId: null
      },
      order: '"time" DESC',
      limit: 10
    }).then(function (result) {
      console.log("Result: ", result)
    })
  },


/**
   * @description Get all 
   * @returns {Promise.<Message>}
   */
  getAll () {
    return Message.findAll({
      raw: true,
      limit: 4
    })
  },


  /**
   * @description Retrieve an existing Message by the unique ID
   * @param req
   * @returns {Promise.<Message>}
   */
  retrieve (req) {
    return Message
      .find({
        where: {
          id: req.id
        },
        
        /*, {
        include: [{
          model: Message,
          as: 'message'
        }]*/
      })
  },



  /**
   * @description
   * @param req
   */
   /*
  vote (req) {
    if (req.value === 1) {
      
    }
    else if (req.value === -1) {
  
    }
    return Message.findById(
      req.params.id
    ).then(function (msg) {
      console.log("Req: ", req)
      console.log(msg.text)
      if (req.value === -1) {
        msg.votesDown ++
      } else {
        msg.votesUp ++
      }
    })
  }
  */

}

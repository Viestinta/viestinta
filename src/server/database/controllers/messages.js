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
    return message.update(message, updates)
  },



  /**
   * @description Delete an existing message
   * @param message
   * @returns {Promise.<Message>}
   */
  delete (message) {
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
        LectureId: null
      },
      order: '"time" DESC',
      limit: 10
    })
  },

  

/**
   * @description Get all 
   * @returns {Promise.<Message>}
   */
  getAll () {
    return Message.findAll({
      raw: true,
      limit: 4,
      order: '"time" DESC'
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
   * @description Changes voting attributes in message
   * @param req
   * @param callback
   * @callback Callbacks when voting attributes have been updated
   */
  vote (req, callback) {
    /*
    return Message.findById(
      req.id
    ).then(function (msg) {
      console.log("Req: ", req)
      console.log(msg)
      if (req.value === -1) {
        //msg.votesDown ++
        msg.updte({votesIp: 1})
        console.log("Increased votesDown")
        if(callback){
          callback()
        }
      } else {
        msg.votesUp ++
        console.log("Increased votesup")
        if(callback){
          callback()
        }
      }
    })
    */

    return Message.update({
      votesUp: 1
    }, {
      where: 
      { id: req.id }
    }).then(function (result) {
      console.log(result)
    })
  }
}

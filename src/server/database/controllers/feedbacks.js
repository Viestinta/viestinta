const Feedback = require('../models/index').Feedback

// Controller for Feedback model

const MIN = 60000
module.exports = {

  // Create a new Feedback using model.create()
  create (req) {
    console.log('[feedbacks] create req: ', req.value)
    return Feedback.create({
      value: req.value
    })
  },

  // Edit an existing Feedback details using model.update()
  update (req) {
    Feedback.update(req.body, {
      where: {
        id: req.params.id
      }
    })

  },

  // For last 5 min
  getLastInterval (req) {
    return Feedback.count({
        where: {
          // TODO: just use createdAt?
          /*time: {
            // Set to 5 * MIN
            $between: [new Date(), new Date(new Date - 5 * 1000)]
          },
          */
          value: -1
        }
      }).then(function (result) {
        console.log('[feedbacks] getLastInterval neg:', result)
        return result
      })
  },

  getAllLecture (req) {
    return Feedback.findAll({
      where: {
        // TODO: just use createdAt?
        time: {       
          $between: [new Date(), new Date(new Date - 120 * MIN)]
        }
      }
    }).then(function (result) {
      console.log(result.count)
    })
  },

    // Delete an existing Feedback by the unique ID using model.destroy()
  delete (req) {
    Feedback.destroy({
      where: {
        id: req.params.id
      }
    })
  }
}
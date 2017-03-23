const Feedback = require('../models/index').Feedback

const Lecture = require('../models/index').Lecture

// Controller for Feedback model

const MIN = 60000

module.exports = {

  // Create a new Feedback using model.create()
  create (req) {
    return Feedback.create({
      value: req.value,
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
  getLastIntervalNeg (lecture) {
    return Feedback.count({
      where: {
        lectureId: lecture.id,
        // TODO: just use createdAt?
        time: {
            // Set to 5 * MIN
          $between: [new Date(new Date() - 5 * MIN), new Date()]
        },
        value: -1
      }
    })
  },

  // For last 5 min
  getLastIntervalPos (lecture) {
    return Feedback.count({
     where: {
        lectureId: lecture.id,
        // TODO: just use createdAt?
        time: {
          // Set to 5 * MIN
          $between: [new Date(new Date() - 5 * MIN), new Date()]
        },
        value: 1
      }
    })
  },

  getAll () {
    return Feedback.findAll()
  },

  getAllToLecture (req) {
    return Feedback.findAll({
      where: {
        createdAt: {
          $between: [new Date(), new Date(new Date() - 120 * MIN)]
        }
        // TODO connect to lecture
      }
    })
  },

    // Delete an existing Feedback by the unique ID using model.destroy()
  delete (req) {
    Feedback.destroy({
      where: {
        id: req.id
      }
    })
  }
}
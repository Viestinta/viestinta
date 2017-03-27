const Feedback = require('../models/index').Feedback

const Lecture = require('../models/index').Lecture

// Controller for Feedback model

const MIN = 60000

module.exports = {

  /**
   * @description Edit an existing Feedback details using model.update()
   * @param req
   */
  update (req) {
    Feedback.update(req.body, {
      where: {
        id: req.params.id
      }
    })
  },



  /**
   * @description Delete an existing Feedback by the unique ID using model.destroy()
   * @param req
   */
  delete (req) {
    Feedback.destroy({
      where: {
        id: req.id
      }
    })
  },



  /**
   * @description Create a new Feedback using model.create()
   * @param req
   * @returns {Promise.<Feedback>}
   */
  create (req) {
    return Feedback.create({
      value: req.value,
    })
  },



  /**
   * @description Gets number of negative feedback for a lecture For the last 5 min
   * @param lecture
   * @returns {Promise.<Integer>}
   */
  getLastIntervalNeg (lecture) {
    return Feedback.count({
      where: {
        LectureId: lecture.id,
        // TODO: just use createdAt?
        time: {
            // Set to 5 * MIN
          $between: [new Date(new Date() - 5 * MIN), new Date()]
        },
        value: -1
      }
    })
  },



  /**
   * @description Gets number of positive feedback for a lecture For the last 5 min
   * @param lecture
   * @returns {Promise.<Integer>}
   */
  getLastIntervalPos (lecture) {
    return Feedback.count({
     where: {
        LectureId: lecture.id,
        // TODO: just use createdAt?
        time: {
          // Set to 5 * MIN
          $between: [new Date(new Date() - 5 * MIN), new Date()]
        },
        value: 1
      }
    })
  },



  /**
   * @description Gets all lectures
   * @returns {Promise.<Array.<Feedback>>}
   */
  getAll () {
    return Feedback.findAll()
  },



  /**
   * @description Gets all lectures from the last 2 hours
   * @param req
   * @returns {Promise.<Array.<Feedback>>}
   */
  getAllToLecture (lecture) {
    return Feedback.findAll({
      where: {
        createdAt: {
          $between: [new Date(), new Date(new Date() - 120 * MIN)]
        }
        // TODO connect to lecture
      }
    })
  }
}

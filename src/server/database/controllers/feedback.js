const Feedback = require('../models/index').Feedback

// Controller for Feedback model

const MIN = 60000

module.exports = {

  /**
   * @description Edit an existing Feedback details using model.update()
   * @param feedback
   * @param updates
   * @returns {Promise<Feedback>}
   */
  updateFeedback (feedback, updates) {
    return feedback.update(updates)
  },



  /**
   * @description Delete an existing Feedback by the unique ID using model.destroy()
   * @param feedback
   * @returns {Promise}
   */
  deleteFeedback (feedback) {
    return feedback.destroy()
  },



  /**
   * @description Create a new Feedback using model.create()
   * @param feedback
   * @returns {Promise.<Feedback>}
   */
  createFeedback (feedback) {
    return Feedback.create({
      value: feedback.value,
      UserId: feedback.UserId,
      LectureId: feedback.LectureId,
      time: feedback.time
    })
  },



  /**
   * @description Gets number of negative feedback for a lecture For the last 5 min
   * @param lecture
   * @returns {Promise.<int>}
   */
  getLastIntervalNeg (lecture) {
    return Feedback.count({
      where: {
        LectureId: lecture.id,
        value: -1
      }
    })
  },



  /**
   * @description Gets number of positive feedback for a lecture For the last 5 min
   * @param lecture
   * @returns {Promise.<int>}
   */
  getLastIntervalPos (lecture) {
    return Feedback.count({
     where: {
        LectureId: lecture.id,
        value: 1
      }
    })
  },



  /**
   * @description Gets all feedback
   * @returns {Promise.<Array.<Feedback>>}
   */
  getAll () {
    return Feedback.findAll()
  },



  /**
   * @description Gets all feedback from the last 2 hours for a lecture
   * @param lecture
   * @returns {Promise.<Array.<Feedback>>}
   */
  getAllToLecture (lecture) {
    return Feedback.findAll({
      where: {
        LectureId: lecture.id
      },
      raw: true
    })
  }
}

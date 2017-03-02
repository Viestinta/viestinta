const Feedback = require('../models/index').Feedback

// Controller for Feedback model

module.exports = {

    // Create a new Feedback using model.create()

  create (req, res) {
    Feedback.create(req.body)
        .then(function (newFeedback) {
          res.status(200).json(newFeedback)
        })
        .catch(function (error) {
          res.status(500).json(error)
        })
  },

    // Edit an existing Feedback details using model.update()
  update (req, res) {
    Feedback.update(req.body, {
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

  // For last 5 min
  calculate (req, res) {
    return Feedback
      .findAll({
        // TODO: just use createdAt?
        time: {
          $lt: new Date()
          $gt: new Date(new Date - 5 * 60000)
        }
      })
  }

    // Delete an existing Feedback by the unique ID using model.destroy()
  delete (req, res) {
    Feedback.destroy({
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
  }
}

const Feedback = require('../models/index').Feedback

// Controller for Feedback model

const MIN = 60000
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
  getLastInterval (req, res) {
    return list = [
      [
        Feedback.count({
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
        })
      ],
      [
        pos = Feedback.count({
          where: {
            // TODO: just use createdAt?
            time: {
              // Set to 5 * MIN
              $between: [new Date(), new Date(new Date - 5 * 1000)]
            },
            value: 1
          }

        }).then(function (result) {
          console.log('[feedbacks] getLastInterval pos:', result)
        })
      ]
    ]
    console.log('[feedbacks] getLastInterval pos:', list)
  },

  getAllLecture (req, res) {
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

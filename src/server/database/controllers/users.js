/**
 * Created by jacob on 20.02.17.
 */

const User = require('../models/index').User
// Controller for user model

module.exports = {

    // Create a new user using model.create()

  create (req, res) {
    User.create(req.body)
    .then(function (newUser) {
      res.status(200).json(newUser)
    })
    .catch(function (error) {
      res.status(500).json(error)
    })
  },

  create (req) {
    return User.create({
      name: req.name
    })
  },

  retriveByName (name) {
    return User.find({
      where: {
        name: name
      }
    })
  },

  // Edit an existing user details using model.update()
  update (req) {
    User.update(req.body, {
      where: {
        id: req.params.id
      }
    })
  },

    // Delete an existing user by the unique ID using model.destroy()
  delete (req, res) {
    User.destroy({
      where: {
        id: req.params.id
      }
    })
  }
}

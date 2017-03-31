/**
 * Created by jacob on 20.02.17.
 */

const User = require('../models/index').User
// Controller for user model

module.exports = {

  /**
   * @description Create a new user using model.create()
   * @param req
   * @param res
   */
  create (req, res) {
    User.create(req.body)
    .then(function (newUser) {
      res.status(200).json(newUser)
    })
    .catch(function (error) {
      res.status(500).json(error)
    })
  },



  /**
   * @description Creates and returns a Promise for a user
   * @param req
   * @returns {Promise.<User>}
   */
  create (req) {
    return User.create({
      name: req.name
    })
  },



  /**
   * @description Retrieves user by name and returns a Promise for that user
   * @param name
   * @returns {Promise.<User>}
   */
  retrieveByName (name) {
    return User.find({
      where: {
        name: name
      }
    })
  },



  /**
   * @description Edits an existing user's details using model.update()
   * @param req
   */
  //
  update (req) {
    User.update(req.body, {
      where: {
        id: req.params.id
      }
    })
  },



  /**
   * @description Deletes an existing user by their unique ID using model.destroy()
   * @param req
   * @param res
   */
  delete (req, res) {
    User.destroy({
      where: {
        id: req.params.id
      }
    })
  }
}

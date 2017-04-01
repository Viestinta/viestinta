/**
 * Created by jacob on 20.02.17.
 */

// Controller for user model
const User = require('../models/index').User
const adminController = require('../controllers/admins')



/**
 * @description Creates and returns a Promise for a user
 * @param user
 * @returns {Promise.<User>}
 */
let findOrCreateUser = function(user) {
  return User.findOrCreate({
    name: user.name,
    student_id: user.student_id,
    email: user.email,
    email_verified: user.email_verified,
    sub: user.sub
  })
}



/**
 * @description Retrieves user by name and returns a Promise for that user
 * @param name
 * @returns {Promise.<User>}
 */
let getByName = function(name) {
  return User.find({
    where: {
      name: name
    }
  })
}



/**
 * @description Gets user by subID and returns a Promise for that user
 * @param sub
 * @returns {Promise.<User>}
 */
let getBySub = function(sub) {
  return User.find({
    where: {
      sub: sub
    }
  })
}



/**
 * @description Retrieves user by email and returns a Promise for that user
 * @param email
 * @returns {Promise.<User>}
 */
let getByEmail = function(email) {
  return User.find({
    where: {
      email: email
    }
  })
}



/**
 * @description Edits an existing user's details using model.update()
 * @param user
 * @param callback
 * @callback
 */
let updateUser = function(user, callback) {
  User.update(user, {
    where: {
      id: user.id
    }
  })
}



/**
 * @description Deletes an existing user by their unique ID
 * @description and deletes the related Admin object if it exists
 * @param user
 * @param callback
 * @callback
 */
let deleteUser = function(user, callback) {
  let Promise = adminController.getBySub(user.sub)
  if (Promise) {
    Promise.then(function (admin) {
      adminController.deleteAdmin(admin).then(function () {
        User.destroy({
          where: {
            id: user.id
          }
        }).then(function () {
          if(callback){
            callback()
          }
        })
      })
    })
  } else {
    User.destroy({
      where: {
        id: user.id
      }
    }).then(function () {
      if (callback){
        callback()
      }
    })
  }
}



module.exports = {
  findOrCreateUser:       findOrCreateUser,
  getByName:              getByName,
  getBySub:               getBySub,
  getByEmail:             getByEmail,
  updateUser:             updateUser,
  deleteUser:             deleteUser,
}

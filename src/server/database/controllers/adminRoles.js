
// Controller for adminRole relation model

const AdminRole = require('../models/index').AdminRole



/**
 * @description Creates or finds an AdminRole
 * @param adminRole
 * @returns {Promise.<AdminRole>}
 */
let findOrCreateAdminRole = function(adminRole) {
  return AdminRole.findOrCreate({
    where: {
      roleType: adminRole.roleType,
      CourseId: adminRole.CourseId,
      UserId: adminRole.UserId,
    },
  })
}



/**
 * @description Get all AdminRoles related to a user
 * @param UserId
 * @returns {Promise.<AdminRole>}
 */
let getAllByUserId = function(UserId) {
  return AdminRole.findAll({
    where: {
      UserId: UserId
    }
  })
}



/**
 * @description Get all AdminRoles related to a course
 * @param CourseId
 * @returns {Promise.<AdminRole>}
 */
let getAllByCourseId = function (CourseId) {
  return AdminRole.findAll({
    where: {
      CourseId: CourseId
    }
  })
}



/**
 * @description Returns a unique adminRole defined by both the user and course
 * @param CourseId
 * @param UserId
 * @returns {Promise.<AdminRole>}
 */
let getSpecificAdminRole = function (CourseId, UserId) {
  return AdminRole.findAll({
    where: {
      CourseId: CourseId,
      UserId: UserId,
    }
  })
}



/**
 * @description Updates the adminRole with a new type
 * @param adminRole
 * @param roleType
 * @return {Promise.<AdminRole>}
 */
let updateAdminRoleType = function (adminRole, roleType) {
  return adminRole.update({roleType: roleType})
}



/**
 * @description Deletes an existing adminRole by their unique ID
 * @param adminRole
 * @returns {Promise.<AdminRole>}
 */
let deleteAdminRole = function(adminRole) {
  return adminRole.destroy()
}



/**
 * @description
 * @param adminRoles
 * @callback Callbacks when all adminRoles have been deleted
 */
let deleteAllAdminRoles = function (adminRoles) {
  return adminRoles.destroy()
}



/**
 * @description Deactivates the AdminRole
 * @param adminRole
 * @returns {Promise.<AdminRole>}
 */
let deactivateAdminRole = function (adminRole) {
  return adminRole.update({active: false})
}



/**
 * @description Activates the AdminRole
 * @param adminRole
 * @returns {Promise.<AdminRole>}
 */
let activateAdminRole = function (adminRole) {
  return adminRole.update({active: true})
}



/**
 * @description Creates an AdminRole for the given course and user
 * @param user
 * @param course
 * @param roleType
 * @returns {Promise.<AdminRole>}
 */
let addUserAsAdminToCourse = function (user, course, roleType){
  return findOrCreateAdminRole({
    roleType: roleType,
    CourseId: course.id,
    UserId: user.id,
  })
}



/**
 * @description Deletes an adminRole specified by user and course
 * @param user
 * @param course
 * @param callback
 * @callback Callbacks when user has been deleted from admins
 */
let deleteUserFromAdmins = function (user, course, callback){

  getSpecificAdminRole(course.id, user.id).spread(function(adminRole, created){

    deleteAdminRole(adminRole).then(function () {

      if(callback){
        callback()
      }
    })
  })
}



module.exports = {
  findOrCreateAdminRole:    findOrCreateAdminRole,
  getAllByUserId:           getAllByUserId,
  getAllByCourseId:         getAllByCourseId,
  getSpecificAdminRole:     getSpecificAdminRole,
  updateAdminRole:          updateAdminRole,
  updateAdminRoleType:      updateAdminRoleType,
  deleteAdminRole:          deleteAdminRole,
  deleteAllAdminRoles:      deleteAllAdminRoles,
  deactivateAdminRole:      deactivateAdminRole,
  activateAdminRole:        activateAdminRole,
  addUserAsAdminToCourse:   addUserAsAdminToCourse,
  deleteUserFromAdmins:     deleteUserFromAdmins,
}

'use strict'

// User model

module.exports = function (sequelize, DataTypes) {
    // Definition of User attributes

  var User = sequelize.define('User', {
    name: DataTypes.STRING,
    student_id: DataTypes.INTEGER,
    email: DataTypes.STRING,
    email_verified: DataTypes.BOOLEAN,
    sub: DataTypes.STRING
  }, {

      // Definition of methods related to the user object
      // class-wide methods
    classMethods: {

        // Associations to other models
      associate: function (models) {
            // associations can be defined here
      },

      getterMethods: {
      },

      setterMethods: {
      }
    }
  })
  return User
}
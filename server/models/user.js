'use strict'

// User model

module.exports = function (sequelize, DataTypes) {
    // Definition of User attributes

  var User = sequelize.define('User', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
      student_id: DataTypes.INTEGER
  }, {

      // Definition of methods related to the user object
      // class-wide methods
    classMethods: {

        // Associations to other models
      associate: function (models) {
            // associations can be defined here
      },

      getterMethods: {
        fullName: function () {
          return this.first_name + ' ' + this.last_name
        }
      },

      setterMethods: {
        fullName: function (value) {
          var names = value.split(' ')

          this.setDataValue('first_name', names.slice(0, -1).join(' '))
          this.setDataValue('last_name', names.slice(-1).join(' '))
        }
      }
    }
  })
  return User
}

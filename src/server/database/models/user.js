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
      /**
       * @description No associations to other models
       * @param models
       */
        // Associations to other models
      associate: function (models) {
        User.hasMany(models.AdminRole, {
         foreignKey: {
           allowNull: true
         }
        })
      }
    }
  })
  return User
}

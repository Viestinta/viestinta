'use strict'

// Course model

module.exports = function (sequelize, DataTypes) {
  // Definition of Course attributes

  let Course = sequelize.define('Course', {
    name: {
      type: DataTypes.STRING,   //Calculus 1
      allowNull: false
    },
    code: {
      type: DataTypes.STRING,   //TMA4100
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    }
  }, {

    // Definition of methods related to the course object
    // class-wide methods
    classMethods: {
      /**
       * @description Course hasMany association to Lecture. Course hasMany association to User.
       * @param models
       */
      // Associations to other models
      associate: function (models) {
        Course.hasMany(models.AdminRole, {
          foreignKey: {
            allowNull: true
          }
        })
      }
    }
  })
  return Course
}

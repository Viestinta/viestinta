'use strict'

// Feedback model

module.exports = function (sequelize, DataTypes) {
  // Definition of Feedback attributes
  var Feedback = sequelize.define('Feedback', {
    time: {
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    value: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {

    // Definition of methods related to the feedback object
    // class-wide methods
    classMethods: {

      // Associations to other models
      associate: function (models) {
        Feedback.belongsTo(models.User, {
          onDelete: 'CASCADE',
          foreignKey: {
            field: 'lectureId',
            allowNull: true
          }
        }),
        Feedback.belongsTo(models.Lecture, {
          onDelete: 'CASCADE',
          foreignKey: {
            field: 'lectureId',
            allowNull: true
          }
        }) 
      }

    }
  })
  return Feedback
}

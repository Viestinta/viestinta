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
      /**
       * @description Associations to lecture model
       * @param models
       */
      associate: function (models) {
        Feedback.belongsTo(models.Lecture, {
          onDelete: 'CASCADE'
        })
        Feedback.belongsTo(models.User, {
          onDelete: 'CASCADE'
        })
      }
    }
  })
  return Feedback
}

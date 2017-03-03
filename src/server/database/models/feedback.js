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
				 // associations can be defined here
         Feedback.belongsTo(models.User, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: true
          }
        })
      },

    },
    /* 
    getterMethods: {
      getLastInterval: function() {
        return Feedback.findAll({
          where: {
            // TODO: just use createdAt?
            time: {
              // Set to 5 * 60000
              $between: [new Date(), new Date(newDate - 5 * 1000)]
            }
          }
        }).then(function (result) {
          console.log(result.count)
        })
      }
    }
    */
  })
  return Feedback
}

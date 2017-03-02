'use strict'

// Message model

module.exports = function (sequelize, DataTypes) {
	// Definition of Message attributes

  var Message = sequelize.define('Message', {
  	time: {
  		type: DataTypes.DATE,
  		defaultValue: new Date()
  	},
  	text: {
  		type: DataTypes.String,
  		allowNull: false
  	}

		// votesUp: DataTypes.INTEGER,
		// votesDown: DataTypes.INTEGER,
  }, {

		// Definition of methods related to the message object
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
  return Message
}

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
  		type: DataTypes.STRING,
  		allowNull: false,
      validate: {
        min: {
          args: [3],
          msg: 'The message must be at least 3 charaters long'
        }
      }
  	},
    //user: {
    //}
    votesUp: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    votesDown: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
  }, {
    classMethods: {
      assosiate: function(models) {
        Message.belongsTo(models.User, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false
          }
        })
      }
    }
  })
  return Message
}

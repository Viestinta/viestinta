'use strict'

// Message model

module.exports = function (sequelize, DataTypes) {
  // Definition of Message attributes
  var Message = sequelize.define('Message', {
    time: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
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
    // user: {
    // }
    // lecture: {}
    votesUp: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    votesDown: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    classMethods: {
      /*
      assosiate: function(models) {
        Message.belongsTo(models.User, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: true
          }
        }),
        // Add lecture
      } */
    },
    instanceMethods: {
      time: {
        get: function () {
          var date = new Date(this.getDataValue('time'))
          // var string = date.getDay() + '.' + date.getMonth() + '.' + date.getYear()

          var hours = date.getHours()
          if (date.getHours() < 10) {
            hours = '0' + date.getHours()
          }else{

          }
          var mins = date.getMinutes()
          if (date.getMinutes() < 10) {
            mins = '0' + date.getMinutes()
          }
          return hours + ":" + mins
        }
      }
    }
  })

  return Message
}

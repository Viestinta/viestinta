'use strict'

// Message model

module.exports = function (sequelize, DataTypes) {
  // Definition of Message attributes
  var Message = sequelize.define('Message', {
    time: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
      // Return date and/or clock in a nice format
      get: function () {
        var date = new Date(this.getDataValue('time'))
        // var string = date.getDay() + '.' + date.getMonth() + '.' + date.getYear()

        var hours = date.getHours()
        if (date.getHours() < 10) {
          hours = '0' + date.getHours()
        }

        var mins = date.getMinutes()
        if (date.getMinutes() < 10) {
          mins = '0' + date.getMinutes()
        }
        return hours + ':' + mins
      }

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

      associate: function (models) {
        Message.belongsTo(models.User, {
          foreignKey: 'userId',
          onDelete: 'CASCADE'
        }),
        Message.belongsTo(models.Lecture, {
          foreignKey: 'lectureId',
          onDelete: 'CASCADE'
        })
      }
    },
    instanceMethods: {

    }
  })

  return Message
}

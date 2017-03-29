// Lecture model

module.exports = function (sequelize, DataTypes) {

  // Definition of Lecture attributes
  let Lecture = sequelize.define('Lecture', {
    name: {
      type: DataTypes.STRING,
    },
    startDate: {
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    endDate: {
      type: DataTypes.DATE,
    },


    //Evt ha en relasjon til et eget "Room" modell
    location: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }

  }, {
    classMethods: {

      setterMethods: {
        setEndDate: function(date){
          this.setDataValue('endDate', date)
        }
      },
      /**
       * @description Associations to User model
       * @param models
       */
      associate: function(models) {

        // Should only be associated in message and feedback

        //Connected users
        Lecture.hasMany(models.User, {
          foreignKey: {
            allowNull: true
          }
        })

        //Lecture has a connected course
        Lecture.belongsTo(models.Course, {
          foreignKey: {
            allowNull: false
          }
        })

      }
    }
  })

  return Lecture
}
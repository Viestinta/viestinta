// Lecture model

module.exports = function (sequelize, DataTypes) {

  // Definition of Lecture attributes
  let Lecture = sequelize.define('Lecture', {
    name: {
      type: DataTypes.STRING
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

  }, {
    classMethods: {

      setterMethods: {
        setEndDate: function(date){
          this.setDataValue('endDate', date)
        }
      },

      associate: function(models) {

        // Should only be associated in message and feedback
        
        //Lecture has a set of messages
        /*
        Lecture.hasMany(models.Message, {
          as: 'messages'
        })
                
        //Lecture has a set of feedbacks 
        Lecture.hasMany(models.Feedback, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: true
          }
        })
        */
        //Admin for lecture
        /*
        Lecture.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        })
        /*
        //Connected users
        Lecture.hasMany(models.User, {
          foreignKey: {
            //field: userId,
            allowNull: true
          }
        })
        */
        //Lecture has a connected course
        /*Lecture.belongsTo(models.Course, {
         foreignKey: {
         allowNull: false
         }
         })*/
      }
    }
  })

  return Lecture
}
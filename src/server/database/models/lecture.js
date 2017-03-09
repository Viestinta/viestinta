// Lecture model

module.exports = function (sequelize, DataTypes) {

  // Definition of Lecture attributes
  var Lecture = sequelize.define('Lecture', {
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

       //Lecture has a set of messages
       Lecture.hasMany(models.Message, {
         onDelete: 'CASCADE',
         foreignKey: {
           allowNull: true
         }
       })

       //Lecture has a set of feedbacks
       Lecture.hasMany(models.Feedback, {
         onDelete: 'CASCADE',
         foreignKey: {
           allowNull: true
         }
       })

       //Admin for lecture
       Lecture.belongsTo(models.User, {
         foreignKey: {
           allowNull: false
         }
       })

       //Connected users
       Lecture.hasMany(models.User, {
         foreignKey: {
           allowNull: true
         }
       })
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
'use strict'

// Course model

module.exports = function (sequelize, DataTypes) {
  // Definition of Course attributes

  let Course = sequelize.define('Course', {
    name: {
      type: DataTypes.STRING,   //Calculus 1
      allowNull: false
    },
    code: {
      type: DataTypes.STRING,   //TMA4100
      allowNull: false
    },
    admins: {                                   //HeadLecturer is default admin
      type: DataTypes.ARRAY(DataTypes.STRING),  //Array of email Strings
      allowNull: false                          //Could have been a relation to a user
    },
    description: {
      type: DataTypes.STRING
    }
  }, {

    // Definition of methods related to the course object
    // class-wide methods
    classMethods: {
      /**
       * @description No associations to other models
       * @param models
       */
      // Associations to other models
      associate: function (models) {
      }
    }
  })
  return Course
}

'use strict'

// AdminRole relation model

module.exports = function (sequelize, DataTypes) {
    // Definition of AdminRole attributes

  var AdminRole = sequelize.define('AdminRole', {
    roleType: {
      type: DataTypes.STRING,
      defaultValue: 'Foreleser'
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {

      // Definition of methods related to the user object
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
  return AdminRole
}

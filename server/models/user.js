'use strict';
module.exports = function(sequelize, DataTypes) {

  var User = sequelize.define('User', {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING
  }, {

    underscored: true,

    classMethods: {
        getterMethods: {
            fullName: function () {
                return this.getDataValue(firstName) + " " + this.getDataValue(lastName);
            }
        },

        setterMethods: {
            fullName: function (value) {
                var names = value.split(' ');
                this.setDataValue('firstName', names.slice(0, -1).join(' '));
                this.setDataValue('lastName', names.slice(-1).join(' '));
            }
        },

        associate: function (models) {
            User.hasMany(models.Lecture, {
              onUpdate: 'cascade'
            });
        }
    }
  });
  return User;
};
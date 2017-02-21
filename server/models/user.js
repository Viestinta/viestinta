'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING
  }, {
    classMethods: {
        associate: function (models) {
            // associations can be defined here
        },
        getterMethods: {
            fullName: function () {
                return this.first_name + ' ' + this.last_name
            }
        },

        setterMethods: {
            fullName: function (value) {
                var names = value.split(' ');

                this.setDataValue('first_name', names.slice(0, -1).join(' '));
                this.setDataValue('last_name', names.slice(-1).join(' '));
            },
        }
    }
  });
  return User;
};
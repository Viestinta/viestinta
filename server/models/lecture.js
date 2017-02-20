'use strict';
module.exports = function(sequelize, DataTypes) {
  var Lecture = sequelize.define('Lecture', {
    lecture_date: DataTypes.DATE
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        Lecture.hasMany(models.User, {
          onUpdate: 'cascade'

        });
      }
    }
  });
  return Lecture;
};
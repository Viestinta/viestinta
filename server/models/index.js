'use strict'

/*

SETUP FOR SEQUELIZE CONNECTION

exports db object with all relevant references to models

 */

var fs = require('fs')
var path = require('path')
var Sequelize = require('sequelize')

var basename = path.basename(module.filename)
var env = process.env.NODE_ENV || 'development'
var config = require(path.join(__dirname, '/../../config/config.js'))[env]
var db = {}

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable])
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config)
}

fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach(function (file) {
    var model = sequelize['import'](path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

sequelize
    .authenticate()
    .then(function (auth) {
      console.log('Connection has been established successfully.')
    })
    .catch(function (err) {
      console.log('Unable to connect to the database:', err)
    })

/*
db['User']
    .findOrCreate({
      where: {first_name: 'Bjarne', last_name: 'Tørring'},
      attributes: ['id', 'first_name', 'last_name']
    }).then(function (user) {
      console.log('No errors!')
      db['User'].findById(29).then(function (user) {
        console.log(user.first_name + ' ' + user.last_name)
      }).catch(function (err) {
        console.error(err)
      })
      db['User'].findById(30).then(function (user) {
        console.log(user.first_name + ' ' + user.last_name)
      }).catch(function (err) {
        console.error(err)
      })
    })
*/
module.exports = db


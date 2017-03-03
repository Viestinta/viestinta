'use strict'

// ///////////////////////////////////////////////////
// Setup for Sequalize connection
// ///////////////////////////////////////////////////

// exports db object with all relevant references to models

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')

const basename = path.basename(module.filename)
const env = process.env.NODE_ENV || 'development'
const config = require(path.join(__dirname, '/../config/config.js'))[env]
let db = {}

var sequelize = new Sequelize(process.env['DATABASE_URL'])

/*if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable])
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config)
}
*/


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
function logExceptOnTest(string) {
    if (process.env.NODE_ENV !== 'test') {
        console.log(string);
    }
}
*/
module.exports = db


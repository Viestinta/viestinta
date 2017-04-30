'use strict'

// ///////////////////////////////////////////////////
// Setup for Sequalize connection
// ///////////////////////////////////////////////////

// Constants declarations
const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')

const basename = path.basename(module.filename)

// Custom logger
const winston = require('winston')
winston.level = process.env.LOG_LEVEL

// Dictionary to store references to the models
let db = {}

// Use the DATABASE_URL String in the environment to connect to the database if it exists
if (process.env['DATABASE_URL']) {
  var options = {logging: false}

  // Disable logging while testing
  if (process.env.LOG_LEVEL === 'debug') {
    options.logging = true
  }

  const dbUrl = process.env.VIESTINTA_OVERWRITE_DATABASE_URL || process.env.DATABASE_URL

  var sequelize = new Sequelize(dbUrl, options)
}

// Adds all models to the database dictionary, "db"
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

// Sequelize authenticates with the database and syncs if it's successful.
sequelize
  .authenticate()
  .then(function (auth) {
    winston.info('[sequelize] Connection has been established successfully.')
  }).then(function () {
    sequelize
    .sync()
    .then(function (err) {
      if (err && process.env.DEBUG) {
        winston.error(err)
      }
      winston.info('[sequelize] Database sync complete')
      if (process.env.VIESTINTA_INIT_DATABASE) {
        require('../../init')
      }
    }, function (err) {
      winston.error('[sequelize] An error occurred while creating the table:', err)
    })
  })
  .catch(function (err) {
    winston.error('[sequelize] Unable to connect to the database:', err)
  })

// exports db object with all relevant references to models
module.exports = db


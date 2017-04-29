const express = require('express')
const path = require('path')
const passport = require('passport')

// Custom logger
const winston = require('winston')
winston.level = process.env.LOG_LEVEL

// Database controllers
const lecturesController = require('./database/controllers/lectures')
const courseController = require('./database/controllers/courses')
const userController = require('./database/controllers/users')
const adminRoleController = require('./database/controllers/adminRoles')
// const redis = require('../server/app.js')

// ///////////////////////////////////////////////////
// Routing
// ///////////////////////////////////////////////////

module.exports = (app) => {
  /* istanbul ignore next */
  const authorized = function (req) {
    return process.env.NODE_ENV === 'test' || req.user
  }

  // Serves the root of the page
  // used to serve React frontend via index.html abd bundle.js
  app.get('/', (req, res) => {
    /* istanbul ignore if */
    if (authorized(req) && req.user) {
      req.session.key = req.user.data.sub
      req.session.name = req.user.data.name
      winston.info('Session key: ' + req.session.key, 'Name: ' + req.session.name)
    }

    res.sendFile(path.resolve(__dirname, '../client/index.html'))
  })

  // API request for serving user data to frontend
  // serves only the data part of the user to not compromise tokens
  /* istanbul ignore next */
  app.get('/user', (req, res) => {
    if (authorized(req)) {
      res.status(200)
      res.json({user: req.user.data})
    } else {
      res.status(404)
    }
  })

  // API request for getting admin information
  // for the corresponding user in the database
  /* istanbul ignore next */
  app.get('/admin', (req, res) => {
    if (authorized(req)) {
      let userinfo = req.user.data
      userController.getByEmail(userinfo.email).then(function (user) {
        adminRoleController.getAllByUserId(user.id).then(function (adminRoles) {
          let counter = 0
          adminRoles.map((adminRole) => {
            courseController.getById(adminRole.CourseId).then(function (course) {
              adminRole = adminRole.toJSON()
              adminRole.course = course
              counter++
              if (counter === adminRoles.length) {
                winston.debug('[routes][database] Found all adminRoles for user, sending response to client')
                res.json(adminRoles)
              }
            })
          })
        })
      })
    }
  })

  // API request for connecting the session user object
  // with the corresponding user in the database
  /* istanbul ignore next */
  app.get('/connect', (req, res) => {
    if (authorized(req)) {
      req.session.user = req.user
      let userinfo = req.user.data
      userController.findOrCreateUser({
        name: userinfo.name,
        email: userinfo.email
      })
      .spread(function (user, created) {
        winston.info('Created user:', user.name)
        winston.info('Created userID:', user.id)
      })
      .catch((err) => {
        winston.error(err)
      })
    } else {
      res.status(403)
    }
    res.redirect('/')
  })

  // API request for gegtting all Lectures
  app.get('/lectures', (req, res) => {
    if (authorized(req)) {
      res.status(200)
      winston.debug('[routes][database] Getting all active lectures')
      lecturesController.getAllActive().then(function (lectures, info) {
        if (!lectures.length) {
          res.status(404)
          res.json([])
          winston.debug('[routes][database] Found no active lectures, returning empty list')
        } else {
          winston.debug('[routes][database] Found active lectures, finding corresponding courses')
          let counter = 0
          lectures.map((lecture) => {
            courseController.getById(lecture.CourseId).then(function (course) {
              lecture = lecture.toJSON()
              lecture.course = course
              counter++
              if (counter === lectures.length) {
                winston.debug('[routes][database] Found all corresponding courses, sending response to client')
                res.json(lectures)
              }
            })
          })
        }
      })
    } else {
      res.status(401)
      res.json([])
      winston.debug('[routes][database] User is not authorized for database access, returning empty list')
    }
  })

  // API request for logging out
  // Currently not working
  /* istanbul ignore next */
  app.get('/logout', (req, res) => {
    req.user = undefined
    req.session.destroy()
    res.redirect('https://auth.dataporten.no/logout')
  })

  // API requests for Passport and OAUTH2 authentication with FEIDE
  app.get('/login', passport.authenticate('passport-openid-connect', {'successReturnToOrRedirect': '/'}))
  app.get('/callback', passport.authenticate('passport-openid-connect', {'callback': true, 'successReturnToOrRedirect': '/connect'}))

  // To get static files
  app.use('/', express.static(path.join(__dirname, '../static')))
  app.use('/css', express.static(path.join(__dirname, '../static/css')))
  app.use('/icons', express.static(path.join(__dirname, '../static/icons')))
}

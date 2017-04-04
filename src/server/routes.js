const express = require('express')
const path = require('path')
const passport = require('passport')
const db = require('./database/models/index')
const lecturesController = require('./database/controllers/lectures')
const redis = require('../server/app.js')

// ///////////////////////////////////////////////////
// Routing
// ///////////////////////////////////////////////////

module.exports = (app) => {

  // Serves the root of the page
  // used to serve React frontend via index.html abd bundle.js
  app.get('/', (req, res) => {
    if(req.user){
      req.session.key = req.user.data.sub
      req.session.name = req.user.data.name
      console.log("Session key: " + req.session.key, "Name: " + req.session.name)
    }

    res.sendFile(path.resolve(__dirname, '../client/index.html'))
  })

  // API request for serving user data to frontend
  // serves only teh data part of the user to not compromise tokens
  app.get('/user', (req, res) => {
    if (req.user) {
      res.status(200)
      res.json({user: req.user.data})
    } else {
      res.status(404)
    }
  })

  // API request for connecting the session user object
  // with the corresponding user in the database
  app.get('/connect', (req, res) => {
    if (req.user) {
      req.session.user = req.user
      let userinfo = req.user.data
      db['User'].findOrCreate({
        where: {name: userinfo.name, sub: userinfo.sub, email: userinfo.email, email_verified: userinfo.email_verified}
      })
      .spread(function (user, created) {
        console.log("Created user:", user.name)
      })
      .catch((err) => {
        console.error(err)
      })
    } else {
      res.status(403)
    }
  })

  // API request for gegtting all Lectures
  app.get('/lectures', (req, res) => {
    if(req.user){
      res.status(200)
      lecturesController.getAll().then(function (lectures) {
        res.json(lectures)
      })
    } else {
      res.status(401)
      res.json([])
    }
  })

  // API request for logging out
  // Currently not working
  app.get('/logout', (req, res) => {
    req.user = undefined
    res.redirect('https://auth.dataporten.no/logout')
  })


  // API requests for Passport and OAUTH2 authentication with FEIDE
  app.get('/login', passport.authenticate('passport-openid-connect', {'successReturnToOrRedirect': '/'}))
  app.get('/callback', passport.authenticate('passport-openid-connect', {'callback': true, 'successReturnToOrRedirect': '/'}))

  // To get static files
  app.use('/', express.static(path.join(__dirname, '../static')))
  app.use('/css', express.static(path.join(__dirname, '../static/css')))
  app.use('/icons', express.static(path.join(__dirname, '../static/icons')))
}

const express = require('express')
const path = require('path')
const passport = require('passport')
const db = require('./database/models/index')
const redis = require('../server/app.js')

// ///////////////////////////////////////////////////
// Routing
// ///////////////////////////////////////////////////

module.exports = (app) => {
  // Go to index.html
  app.get('/', (req, res) => {
    if(req.user){
      req.session.key = req.user.data.sub
      req.session.name = req.user.data.name
      console.log("Session key: " + req.session.key, "Name: " + req.session.name)
    }

    res.sendFile(path.resolve(__dirname, '../client/index.html'))
  })
  app.get('/user', (req, res) => {
    if (req.user) {
      res.status(200)
      res.json({user: req.user.data})
    } else {
      res.status(404)
    }
  })

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

  app.get('/lectures', (req,res) => {
    //TODO: Possible to connect to Redis instead of database for better performance

    /*db['Lecture'].create({
      startDate: new Date(),
      endDate: new Date(),
      name: "TestLecture1",
      isActive: true
    }).then(function (data) {
      db['Lecture'].create({
        startDate: new Date(),
        endDate: new Date(),
        name: "TestLecture2",
        isActive: true
      }).then(function () {*/
        if (req.user) {
          db['Lecture'].findAll({
            raw: true,
            where: {
              isActive: true
            }
          }).then(function (lectures) {
            console.log("Found active lectures: ", lectures)
            res.status(200)
            res.json(lectures)
          })
        }
  //    })

    //})

  })

  app.get('/logout', (req, res) => {
    req.user = undefined
    res.redirect('https://auth.dataporten.no/logout')

  })
  app.get('/login', passport.authenticate('passport-openid-connect', {'successReturnToOrRedirect': '/'}))
  app.get('/callback', passport.authenticate('passport-openid-connect', {'callback': true, 'successReturnToOrRedirect': '/'}))

  // To get static files
  app.use('/', express.static(path.join(__dirname, '../static')))
  app.use('/css', express.static(path.join(__dirname, '../static/css')))
  app.use('/icons', express.static(path.join(__dirname, '../static/icons')))

  // Related to database
}

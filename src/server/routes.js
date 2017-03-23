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
      req.session.user = req.user
      console.log("Session" + req.session)
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
    redis.get('"sess:' + req.session.id + '"', function(err, result){
      console.log("Get session: " + util.inspect(result,{ showHidden: true, depth: null }));
    });
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

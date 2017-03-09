
const path = require('path')
const passport = require('passport')
const db = require('./database/models/index')

const app = require('./app')

// ///////////////////////////////////////////////////
// Routing
// ///////////////////////////////////////////////////

module.exports = (app) => {
  // Go to index.html
  app.get('/', (req, res) => { res.sendFile(path.resolve(__dirname, '../client/index.html')) })
  app.get('/user', (req, res) => {
    if (req.user) {
      res.json({user: req.user})
    } else {
      res.status(404)
    }
  })

  app.get('/connect', (req, res) => {
    if (req.user) {
      let userinfo = req.user.data
      db['User'].findOrCreate({
        where: {name: userinfo.name, sub: userinfo.sub, email: userinfo.email, email_verified: userinfo.email_verified}
      })
            .spread(function (user, created) {
              console.log(user)
            })
          .catch((err) => {
            console.error(err)
          })
    } else {
      res.status(403)
    }
  })

  app.get('/login', passport.authenticate('passport-openid-connect', {'successReturnToOrRedirect': '/'}))
  app.get('/callback', passport.authenticate('passport-openid-connect', {'callback': true, 'successReturnToOrRedirect': '/'}))

  app.server.listen(app.get('port'), (err) => {
    if (err) throw err
    console.log('Node app is running on port', app.get('port'))
  })

  // To get static files
  app.use('/', app.express.static(path.join(__dirname, '../static')))
  app.use('/css', app.express.static(path.join(__dirname, '../static/css')))
  app.use('/icons', app.express.static(path.join(__dirname, '../static/icons')))
}

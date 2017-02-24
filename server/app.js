
// ///////////////////////////////////////////////////
// Server/Root File For The Viestinta Project
// ///////////////////////////////////////////////////

// ///////////////////////////////////////////////////
// Include Statments
// ///////////////////////////////////////////////////

const express = require('express')
const passport = require('passport')
const bodyparser = require('body-parser')
const cookieparser = require('cookie-parser')
const session = require('express-session')
// const morgan = require('morgan')
const nconf = require('nconf')

const path = require('path')
const PDStrategy = require('passport-openid-connect').Strategy
//const PDStrategy = require('./passport/Strategy.js').Strategy
// const User = require('passport-openid-connect').User

// ///////////////////////////////////////////////////
// Initial Server Setup
// ///////////////////////////////////////////////////

nconf.argv()
  .env('__')
  .file({ file: 'server/etc/config.json' })
  .defaults({
    'http': {
      'port': 8080,
      'enforceHTTPS': false
    },
    'session': {
      'secret': 'SSSSEEEECCCCRRRREEEETTTTSECRET'
    },
    'dataporten': {
      'enableAuthentication': false
    }
  })

const app = express()
app.set('view options', { pretty: true })
app.set('json spaces', 2)
app.set('port', 8000)

app.use(cookieparser())
app.use(bodyparser.urlencoded({extended: true}))
app.use(bodyparser.json())
app.use(session({
  secret: 'MagicSealsAndNarwalsDancingTogetherInRainbows',
  resave: false,
  saveUninitialized: false
}))

var pd = new PDStrategy(nconf.get('dataporten'))

passport.use(pd)
passport.serializeUser(PDStrategy.serializeUser)
passport.deserializeUser(PDStrategy.deserializeUser)

app.use(passport.initialize())
app.use(passport.session())

// ///////////////////////////////////////////////////
// Main App
// ///////////////////////////////////////////////////

// app.get('/', (req, res) => {res.json({'hello': 'world', 'user': req.user})})
// Go to index.html
app.get('/', (req, res) => { res.sendFile(path.resolve(__dirname, '../client/index.html')) })

app.get('/user', (req, res) => res.json({'hello': 'world', 'user': req.user}))
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
app.get('/login', passport.authenticate('passport-openid-connect', {'successReturnToOrRedirect': '/user'}))
app.get('/callback', passport.authenticate('passport-openid-connect', {'callback': true, 'successReturnToOrRedirect': '/user'}))

app.get('/test', (req, res) => {
  res.json(req.user)
})

app.listen(app.get('port'), (err) => {
  if (err) throw err
  console.log('Node app is running on port', app.get('port'))
})

app.use('/', express.static(path.resolve(__dirname, '../client/')))
app.use(express.static(path.resolve(__dirname, '../client/css/')))
app.use('/components', express.static(path.resolve(__dirname, '../client/components')))
app.use('/css', express.static(path.resolve(__dirname, '../client/css')))

// SETUP FOR DATABASE
// TODO: Flytt til annen fil, eller gjør som del av user login/creation. Må bare kjøres før user objektet skal brukes.

var db = require('../server/models/index')

var user = db['User']
user.sync({force: true}).then(function () {
  return user.create({
    name: 'Pekka Foreleser'
  })
})

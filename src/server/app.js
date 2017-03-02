
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
// const User = require('passport-openid-connect').User

// ///////////////////////////////////////////////////
// Initial Server Setup
// ///////////////////////////////////////////////////

nconf.argv()
  .env('__')
  .file({ file: path.resolve(__dirname, './etc/config.json') })
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
const server = require('http').createServer(app)

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
// Routing
// ///////////////////////////////////////////////////

// URL-specifications
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

server.listen(app.get('port'), (err) => {
  if (err) throw err
  console.log('Node app is running on port', app.get('port'))
})

// ///////////////////////////////////////////////////
// Setup for database
// ///////////////////////////////////////////////////

// TODO: Flytt til annen fil, eller gjør som del av user login/creation. Må bare kjøres før user objektet skal brukes.

const db = require('./database/models/index')

const user = db['User']
const message = db['Message']
const feedback = db['Feedback']

const userController = require('./database/controllers').user
const messageController = require('./database/controllers').message
const feedbackController = require('./database/controllers').feedback

user.sync({force: true}).then(function () {
  return user.create({
    name: 'Pekka Foreleser'
  })
})

// Create a connection
// var socket = io.connect('http://localhost::8000')
var io = require('socket.io')(server)

// When a new user connects
io.sockets.on('connect', function (socket) {
  console.log('New client have connected in app')
    // TODO: get x last messages in chat and send
    // TODO: get status of feedback and send
    // socket.emit('connect', "You are connected")
})

// Listen for connections
io.sockets.on('connection', function (socket) {
  // Reports when it finds a connection
  console.log('Client connected')

  // Wait for a message from the client for 'join'
  socket.on('join', function (data) {
    console.log('New client have joined')
    socket.emit('messages', 'Hello from server')
  })

  // Wait for a message from the client for 'join'
  socket.on('leave', function (data) {
    console.log('Client have left')
    socket.emit('messages', 'Goodbye from server')
  })

  // When a new message is sendt from somebody
  socket.on('new-message', function (msg) {
    messageController.create({
      // Save user
      text: msg.text
    })
    console.log('Message in new-message in app.js: ' + msg.text)
    io.sockets.emit('receive-message', msg)
  })

  socket.on('new-feedback', function (feedback) {
    // TODO: save in database
    feedbackController.create({
      value: feedback
    })
    console.log('Received feedback in io.socket.on: ', feedback)
    io.sockets.emit('receive-feedback', feedback)
  })

  // Called every x minuts
  socket.on('updateFeedbackInterval', function () {
    // Get feedback from database for past x minuts

    io.sockets.emit('updateFeedbackInterval')
  })
})

// To get static files
app.use('/', express.static(path.join(__dirname, '../static')))
app.use('/css', express.static(path.join(__dirname, '../static/css')))
app.use('/icons', express.static(path.join(__dirname, '../static/icons')))

module.exports = io
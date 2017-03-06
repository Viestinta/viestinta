
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
const messageObj = db['Message']
const feedbackObj = db['Feedback']

const users = require('./database/controllers').users
const messagesController = require('./database/controllers').messages
const feedbacksController = require('./database/controllers').feedbacks

// Create tables, and drop them if they allready exists (force: true)
user.sync({force: true}).then(function () {
  return user.create({
    name: 'Pekka Foreleser'
  })
})

messageObj.sync({force: true}).then(function () {
  return messageObj.create({
    text: "Just testing"
  })
  
})

feedbackObj.sync().then(function () {
  
  return feedbackObj.create({
    value: -1
  })


})

// Create a connection
// var socket = io.connect('http://localhost::8000')
var io = require('socket.io')(server)

// When a new user connects
io.sockets.on('connect', function (socket) {
  console.log('[app] connect')

  // feedbacksController.getAll()

  // TODO: get x last messages in chat and send
  // TODO: get status of feedback and send
  var feedback = feedbacksController.getLastIntervalNeg().then(function(resultNeg) {
    console.log("ResultNeg: ", resultNeg)
    feedbacksController.getLastIntervalPos().then(function(resultPos) {
      console.log("ResultPos: ", resultPos)
      socket.emit('update-feedback-interval', [resultNeg, resultPos])
    })
  })
  console.log("[app] connect - After sending feedback in")
})

// Listen for connections
io.sockets.on('connection', function (socket) {
  // Reports when it finds a connection
  console.log('[app] connection')

  // Wait for a message from the client for 'join'
  socket.on('join', function (data) {
    console.log('[app] join')
    socket.emit('messages', 'Hello from server')
  })

  // Wait for a message from the client for 'join'
  socket.on('leave', function (data) {
    console.log('[app] left')
    socket.emit('messages', 'Goodbye from server')
  })

  // When a new message is sendt from somebody
  socket.on('new-message', function (msg) {
    console.log('[app] new-message: ' + msg)
    messagesController.create(msg)
    
    io.sockets.emit('receive-message', msg)
  })

  // When somebody gives feedback
  socket.on('new-feedback', function (feedback) {
    console.log('[app] new-feedback: ' + feedback)
    feedbacksController.create({
      value: feedback
    })
    console.log('[app] new-feedback: after')
    io.sockets.emit('receive-feedback', feedback)
  })

  // Called every x minuts
  socket.on('update-feedback-interval', function () {
    // Get feedback from database for past x minuts
    var feedback = feedbacksController.getLastIntervalNeg().then(function(resultNeg) {
    feedbacksController.getLastIntervalPos().then(function(resultPos) {
      io.sockets.emit('update-feedback-interval', [resultNeg, resultPos])
    })
  })
    io.sockets.emit('update-feedback-interval')
  })
})

// To get static files
app.use('/', express.static(path.join(__dirname, '../static')))
app.use('/css', express.static(path.join(__dirname, '../static/css')))
app.use('/icons', express.static(path.join(__dirname, '../static/icons')))
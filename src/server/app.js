
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

const router = require('./routes') 
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

router(app)

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
const lecture = db['Lecture']
const message = db['Message']
const feedback = db['Feedback']

const usersController = require('./database/controllers').users
const lecturesController = require('./database/controllers').lectures
const messagesController = require('./database/controllers').messages
const feedbacksController = require('./database/controllers').feedbacks


// Create tables, and drop them if they allready exists (force: true)
user.sync().then(function () {
  return user.create({
    name: 'Pekka'
  })
})

message.sync().then(function () {

})

feedback.sync().then(function () {

})

lecture.sync().then(function () {
  lecture.create({
    name: 'TDT4145-1'
  }),
  lecture.create({
    name: 'TDT4140-3'
  })

})

// Create a connection
// var socket = io.connect('http://localhost::8000')
var io = require('socket.io')(server)

// When a new user connects
io.sockets.on('connection', function (socket) {
  // Reports when it finds a connection
  console.log('[app] connection')

  socket.on('login', function (data) {
    console.log('[app] login')
    // Set user
    //socket.set('user', user)
    
    usersController.retriveByName('Pekka').then(function (user) {
      console.log("User: ", user.name)
      // Save user in socket-connection
      socket.user = user
    })

    // Hardcoding to choose a lecture 
    lecturesController.retriveByName('TDT4145-1').then(function (lecture) {
      console.log("Lecture: ", lecture.name)
      // Save lecture in socket-connection
      socket.lecture = lecture

      console.log("Before getting feedback")
      // Get feedback status for last x min
      
      feedbacksController.getLastIntervalNeg(lecture).then(function (resultNeg) {
        feedbacksController.getLastIntervalPos(lecture).then(function (resultPos) {
          socket.emit('update-feedback-interval', [resultNeg, resultPos])
        })
      })
      
      console.log("Before getting messages")
      // Get all messages to that lecture
      messagesController.getAllToLecture(lecture).then(function (result) {
        socket.emit('last-ten-messages', result.reverse())
      })
    })
    
  })

  socket.on('create-lecture', function (lecture) {
    console.log('[app] create-lecture')

    // TODO: missing
  })

  socket.on('choose-lecture', function (lecture) {
    console.log('[app] choose-lecture')

    lectures.Controller.retriveByName('TDT4145-1').then(function (result) {
      socket.lecture = lecture
      // Get feedback status for last x min
      feedbacksController.getLastIntervalNeg(lecture).then(function (resultNeg) {
        feedbacksController.getLastIntervalPos(lecture).then(function (resultPos) {
          socket.emit('update-feedback-interval', [resultNeg, resultPos])
        })
      })
      // Get last 10 messages
      messagesController.getLastTen(lecture).then(function (result) {
        socket.emit('last-ten-messages', result.reverse())
      })
    })
  })

  // Wait for a message from the client for 'join'
  socket.on('leave', function (data) {
    console.log('[app] left')
    socket.emit('messages', 'Goodbye from server')
  })

  // When a new message is sendt from somebody
  socket.on('new-message', function (msg) {
    console.log('[app] new-message: ' + msg)
    messagesController.create(msg).then(function (result) {
      //result.setUser(socket.user)
      result.setLecture(socket.lecture)
    })

    io.sockets.emit('receive-message', msg)
  })

  // When somebody gives feedback
  socket.on('new-feedback', function (feedback) {
    console.log('[app] new-feedback: ' + feedback)
    feedbacksController.create({
      value: feedback
    }).then(function (result) {
      // Create association between feedback and lecture
      result.setLecture(socket.lecture)
    })
    console.log('[app] new-feedback: after')
    io.sockets.emit('receive-feedback', feedback)
  })

  // Called every x minuts
  socket.on('update-feedback-interval', function () {
    // Get feedback from database for past x minuts
    feedbacksController.getLastIntervalNeg().then(function (resultNeg) {
      feedbacksController.getLastIntervalPos().then(function (resultPos) {
        io.sockets.emit('update-feedback-interval', [resultNeg, resultPos])
      })
    })
    io.sockets.emit('update-feedback-interval')
  })
})

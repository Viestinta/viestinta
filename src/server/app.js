
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
const redisAdapter = require('socket.io-redis');
const session = require('express-session')

//'redis' is a relative Docker IP, supply URL in env if it's not Docker
var redisHost = process.env['REDIS_URL'] || 'redis'

const redis = require("redis").createClient('6379', redisHost)
const RedisStore = require("connect-redis")(session)

const nconf = require('nconf')
const path = require('path')

const PDStrategy = require('passport-openid-connect').Strategy
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


// ///////////////////////////////////////////////////
// Redis and ExpressJS session setup
// ///////////////////////////////////////////////////

//Creating Redis SessionStore
const sessionStore = new RedisStore({ host: redisHost, port: 6379, client: redis })

//Declaring session options
let sess = {
  secret: 'MagicSealsAndNarwalsDancingTogetherInRainbows',
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {}
}

//Enable secure cookies for production env, using HTTPS
if (app.get('env') === 'production') {
  sess.cookie.secure = true
}

//Connects to Redis server
redis.on('connect', function () {
  console.log("Redis connected")
})

//Sends the session object to Express,
// containing the sess options and references to the Redis SessionStorage
app.use(session(sess))

//Session handling for disconnects

app.use(function (req, res, next) {
  if (!req.session) {
    return next(new Error('oh no')) // handle error
  }
  next() // otherwise continue
})


// ///////////////////////////////////////////////////
// Passport/Dataporten setup
// ///////////////////////////////////////////////////

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

// Prevent NodeJS container from locking into listen when running in test env
if (process.env.NODE_ENV !== 'test') {
  server.listen(app.get('port'), (err) => {
    if (err) throw err
    console.log('Node app is running on port', app.get('port'))
  })
}


// ///////////////////////////////////////////////////
// Setup for SocketIO
// ///////////////////////////////////////////////////

const db = require('./database/models/index')

const user = db['User']
const lecture = db['Lecture']
const message = db['Message']
const feedback = db['Feedback']

const usersController = require('./database/controllers').users
const lecturesController = require('./database/controllers').lectures
const messagesController = require('./database/controllers').messages
const feedbacksController = require('./database/controllers').feedbacks

//Create SocketIO server
var io = require('socket.io')(server)

//Setup Redis adapter for SocketIO
io.adapter(redisAdapter({ host: redisHost, port: 6379, client: redis }))

// When a new user connects
io.sockets.on('connection', function (socket) {

/*  io.of('/').adapter.clients(function (err, clients) {
    console.log("Connected clients: " + clients); // an array containing all connected socket ids
  })

  io.of('/').adapter.allRooms(function (err, rooms) {
    if (err) { console.log("Unknown ID: " + err) }
    console.log("All rooms:" + rooms); // an array containing every room a given id has joined.

  })
*/
  // Reports when it finds a connection
  console.log('[app] connection')

  socket.on('login', function (data) {
    console.log('[app] login')
    //Create test user
    user.create({name: 'Pekka'})
      .then(function () {
        // Set user
        // socket.set('user', user)
        //sessionStore.get(req.cookies['connect.sid'], function (err, session) {
        // console.log(session);
        //})
        usersController.retriveByName('Pekka').then(function (user) {
          console.log('User: ', user.name)
          // Save user in socket-connection
        })
      })
  })
  /*
    //Create test lecture
    lecture.create({
      name: 'TDT4145-1'
    }).then(function () {
      lecture.create({
        name: 'TDT4140-3'
      })
    }).then(function () {
      // Hardcoding to choose a lecture
      lecturesController.retriveByName('TDT4145-1').then(function (lecture) {
        console.log('Lecture: ', lecture.name)
        // Save lecture in socket-connection
        socket.lecture = lecture

        console.log('Before getting feedback')
        // Get feedback status for last x min

        feedbacksController.getLastIntervalNeg(lecture).then(function (resultNeg) {
          feedbacksController.getLastIntervalPos(lecture).then(function (resultPos) {
            socket.emit('update-feedback-interval', [resultNeg, resultPos])
          })
        })

        console.log('Before getting messages')
        // Get all messages to that lecture
        messagesController.getAllToLecture(lecture).then(function (result) {
          socket.emit('last-ten-messages', result.reverse())
        })
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
*/
  // When a new message is sendt from somebody
  socket.on('new-message', function (msg) {
    console.log('[app] new-message: ' + msg.text)
    messagesController.create(msg).then(function (result) {
      //result.setUser(socket.user)
      //result.setLecture(socket.lecture)
      io.sockets.emit('receive-message', {
        text: result.text,
        time: result.time,
        UserId: result.UserId,
        LectureId: result.LectureId
      })
    })
  })
/*
  // When a new message is sendt from somebody
  socket.on('new-voting-message', function (id, value) {
    console.log('[app] new-voting-message: ' + value)
    messagesController.vote({
      msgId: id,
      value: value
    }).then(function (result) {
      io.sockets.emit('updated-message', result)
    })
  })
*/
  // When somebody gives feedback
  socket.on('new-feedback', function (feedback) {
    console.log('[app] new-feedback: ' + feedback)
    feedbacksController.create({
      value: feedback
    }).then(function (result) {
      // Create association between feedback and lecture
      result.setLecture(socket.lecture)
      io.sockets.emit('receive-feedback', {value: result.value})
    })
  })
/*
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


  io.of('/').adapter.remoteJoin('<my-id>', 'room1', function (err) {
    if (err) {  unknown id  }
    // success
   })

  io.on('connection', (socket) => {

    socket.on('message-all', (data) => {
      io.emit('message-all', data)
    })

    socket.on('join', (room) => {
      socket.join(room)
      io.emit('message-all', "Socket " + socket.id + " joined to room " + room)
    })

    socket.on('message-room', (data) => {
      const room = data.room;
      const message = data.message;
      io.to(room).emit('message-room', data)
    })
*/
})

module.exports = redis

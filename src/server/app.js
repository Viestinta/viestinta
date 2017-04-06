
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

const RedisStore = require("connect-redis")(session)

//Create SocketIO server
var io = require('socket.io')(server)


//'redis' is a relative Docker IP, supply URL in env if it's not Docker
var redisHost = process.env['REDIS_URL'] || 'redis'
if (process.env.NODE_ENV !== 'test') {

  //Create redis client
  const redis = require("redis").createClient('6379', redisHost)

  //Creating Redis SessionStore
  const sessionStore = new RedisStore({host: redisHost, port: 6379, client: redis})

  io.adapter(redisAdapter({ host: redisHost, port: 6379, client: redis })) //Faulty warning for client: redis

  //Connects to Redis server
  redis.on('connect', function () {
    console.log("Redis connected")
  })

  //Declaring session options
  let sess = {
    secret: process.env.VIESTINTA_SESSION_SECRET || 'MagicSealsAndNarwalsDancingTogetherInRainbows',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {}
  }

  //Enable secure cookies for production env, using HTTPS
  if (app.get('env') === 'production') {
    sess.cookie.secure = true
  }

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
}



// ///////////////////////////////////////////////////
// Passport/Dataporten setup
// ///////////////////////////////////////////////////

// Get all the config items from nconf in one request
let pd_config_nconf = nconf.get('dataporten')

// Set OAUTH2 config with either environment variables
// or if they are not available, get them from nconf (./etc/config.json)
let pd_config = {
    "issuerHost": process.env.VIESTINTA_OAUTH2_HOST_URL || pd_config_nconf.issuerHost,
    "client_id": process.env.VIESTINTA_OAUTH2_CLIENT_ID || pd_config_nconf.client_id,
    "client_secret": process.env.VIESTINTA_OAUTH2_CLIENT_SECRET || pd_config_nconf.client_secret,
    "redirect_uri": process.env.VIESTINTA_OAUTH2_REDIRECT_URI || pd_config_nconf.redirect_uri,
    "scope": process.env.VIESTINTA_OAUTH2_SCOPE || pd_config_nconf.scope
  }

// Initialize a PassportDataportenStrategy with the OAUTH2 config 
var pd = new PDStrategy(pd_config)

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

const usersController = require('./database/controllers/users')
const lecturesController = require('./database/controllers/lectures')
const messagesController = require('./database/controllers/messages')
const feedbacksController = require('./database/controllers/feedback')
const courseController = require('./database/controllers/courses')
const adminRoleController = require('./database/controllers/adminRoles')



//io server is defined in the Redis/Express section further up


let initCourse = undefined

setTimeout(function () {
  lecturesController.getByName("Enkle matriseoperasjoner").then(function (lecture) {
    if (!lecture) {
      initCourse = true
    }
  })
}, 5000)

// When a new user connects
io.sockets.on('connection', function (socket) {


  if(initCourse) {

    let testCourse1 = undefined
    let testCourseName1 = "Matematikk 3"
    let testCourseCode1 = "TMA4115"

    let testLecture1 = undefined
    let testLectureName1 = "Enkle matriseoperasjoner"

    courseController.findOrCreateCourse({
      name: testCourseName1,
      code: testCourseCode1
    }).spread(function (course, created) {
      testCourse1 = course
      lecturesController.createLecture({
        name: testLectureName1,
        CourseId: testCourse1.id
      }).then(function (lecture) {
        testLecture1 = lecture
      })
    })

    let testCourse2 = undefined
    let testCourseName2 = "Krets- og digitalteknikk"
    let testCourseCode2 = "TFE4101"

    let testLecture2 = undefined
    let testLectureName2 = "Ohms Lov"

    courseController.findOrCreateCourse({
      name: testCourseName2,
      code: testCourseCode2
    }).spread(function (course, created) {
      testCourse2 = course
      lecturesController.createLecture({
        name: testLectureName2,
        CourseId: testCourse2.id
      }).then(function (lecture) {
        testLecture2 = lecture
      })
    })

    let testCourse3 = undefined
    let testCourseName3 = "Objektorientert programmering"
    let testCourseCode3 = "TDT4100"

    let testLecture3 = undefined
    let testLectureName3 = "Intro til Java"

    courseController.findOrCreateCourse({
      name: testCourseName3,
      code: testCourseCode3
    }).spread(function (course, created) {
      testCourse3 = course
      lecturesController.createLecture({
        name: testLectureName3,
        CourseId: testCourse3.id
      }).then(function (lecture) {
        testLecture3 = lecture
      })
    })

    initCourse = false
  }
  // Reports when it finds a connection
  console.log('[app] connection')

  socket.on('login', function (data) {
    console.log('[app] login')
  })


  socket.on('create-lecture', function (socketLecture) {
    console.log('[app] create-lecture')
    
    // TODO: us20 missing
  })

  /**
   * @template socketLecture: {
      id: (int),
      code: (string),
      room: (string),
    }
   */
  socket.on('leave-lecture', function (socketLecture) {
    console.log('[app][socket] leave-lecture ' + socketLecture.room)
    socket.user = undefined
    socket.LectureId = undefined
    socket.CourseCode = undefined
    socket.room = undefined
    socket.leave(socketLecture.room)
  })

  /**
   * @template socketLecture: {
      id: (int),
      code: (string),
      room: (string),
    }
   */
  socket.on('join-lecture', function (socketLecture) {
    console.log('[app][socket] join-lecture ' + socketLecture.room)

    socket.user = socketLecture.user
    usersController.getByEmail(socket.user.email).then(function (user) {
      socket.UserId = user.id
    })
    socket.LectureId = socketLecture.id
    socket.CourseCode = socketLecture.code
    socket.room = socketLecture.room
    socket.join(socketLecture.room)

    console.log('[app][socket] Connected to lecture with ID: ' + socket.LectureId)
    console.log('[app][socket] For course with code: ' + socket.CourseCode)
    console.log('[app][socket] as user with username: ' + socket.user.name)
    console.log('[app][socket] Joined room identifier: ' + socket.room)


    // Get feedback status for last x min
    feedbacksController.getLastIntervalNeg({id: socket.LectureId}).then(function (resultNeg) {
      feedbacksController.getLastIntervalPos({id: socket.LectureId}).then(function (resultPos) {
        socket.emit('update-feedback-interval', [resultNeg, resultPos])
      })
    })
    messagesController.getAllToLecture({id: socket.LectureId}).then(function (result) {
      socket.emit('all-messages', result.reverse())
    })
  })


  /** TODO: lecture can be removed, because of the new socket variables
   * @deprecated
   * @template msg: {
      text: (string),
      lecture: {
        id: (int),
        code: (string),
        room: (string),
      }
    }
   */
  socket.on('new-message', function (msg) {
    console.log('[app] new-message: ' + msg.text)
    console.log('[app][socket] Message destined for Room: ' + socket.room)

    let databaseMsg = {
      text: msg.text,
      LectureId: socket.LectureId,
      UserId: socket.UserId
    }

    messagesController.createMessage(databaseMsg).then(function (result) {
      io.sockets.in(socket.room).emit('receive-message', {
        text: result.text,
        time: result.time,
        votesUp: result.votesUp,
        votesDown: result.votesDown,
        UserId: result.UserId,
        LectureId: result.LectureId
      })
    })
  })

  // When somebody votes on a message
  socket.on('new-vote-on-message', function (msgId, value) {
    console.log('[app] new-voting-message: ' + msgId + " with " + value)

    messagesController.vote({
      id: msgId,
      value: value
    }).then(function () {

      messagesController.getAllToLecture({
        id: socket.LectureId
      }).then(function (msgList) {

        io.sockets.in(socket.room).emit('update-message-order', msgList)
      })
    })
      
  })

  // When somebody gives feedback

  /** TODO: Remove lecture, it's defined in the socket itself now
   * @deprecated
   * @template feedback: {
      value: (int),
      lecture: {
        id: (int),
        code: (string),
        room: (string),
      }
    }
   */
  socket.on('new-feedback', function (feedback) {
    console.log('[app] new-feedback: ' + feedback.value + ' to room: ' + socket.room)
    feedbacksController.createFeedback({
      value: feedback.value,
      LectureId: socket.LectureId,
      UserId: socket.UserId
    }).then(function (result) {
      io.sockets.in(socket.room).emit('receive-feedback', {value: result.value})
    })
  })

  // Called every x minuts
  socket.on('update-feedback-interval', function () {
    // Get feedback from database for past x minuts

    feedbacksController.getLastIntervalNeg().then(function (resultNeg) {
      feedbacksController.getLastIntervalPos().then(function (resultPos) {
        io.sockets.in(socket.room).emit('update-feedback-interval', [resultNeg, resultPos])
      })
    })
  })

  socket.on('disconnect', function() {
    //TODO: Do something on disconnect?
  })

})

//For fake module export in test env
if(process.env.NODE_ENV !== 'test'){
  var redis = 10
}
module.exports = redis

const viestinta = [
  "       _           _   _       _        ",
  "__   _(_) ___  ___| |_(_)_ __ | |_ __ _ ",
  "\\ \\ / / |/ _ \\/ __| __| | '_ \\| __/ _` |", 
  " \\ \V /| |  __/\\__ \\ |_| | | | | || (_| |",
  "  \\_/ |_|\\___||___/\\__|_|_| |_|\\__\\__,_|",
  "                                        ",
]

console.log(viestinta.join('\n'))
